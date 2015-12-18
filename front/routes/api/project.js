var md5 = require('md5');
var locale = require('../../public/app/locale/en.json');
var config = require('../../auth/config.json');
var mysql = require('mysql');
var connectionPool = mysql.createPool(config);
var async = require('async');

module.exports = function (app) {
	// 프로젝트 리스트
	app.get('/api/project/list', function(req, res, next) {
		res.header('Access-Control-Allow-Origin', '*');
		if(req.user){
			var user_id = req.user.id;
			var is_superuser = req.user.is_superuser;
			connectionPool.getConnection(function(err, connection) {

				// 관리자인 경우 최근 1주일동안 에러가 수집된 프로젝트 리스트 리턴
				if (is_superuser === 1) {
					async.waterfall([
						function(callback) {
							var queryString = 'select * from projects ' +
								'where pid in (select pid from errors where lastdate >= date(now()) - interval 6 day)';
							connection.query(queryString, [user_id], function(err, rows, fields) {
								if (err) {
									res.status(500);
									res.json({});
									connection.release();
								} else {
									var projects = [];
									for (var i = 0; i < rows.length; i++) {
										var element = {};
										async.waterfall([
											function(callback) {
												element = rows[i];
												delete element.owner_uid;
												callback(null, i, element);
											},

											//weekly error count 정보 추가
											function(index, element, callback) {
												var queryString = 'select count(*) as weekly_errorcount ' +
													'from instances ' +
													'where pid = ? and datetime >= date(now()) - interval 6 day';
												connection.query(queryString, [element.pid], function(err, rows, fields) {
													if (err) {
														res.status(500);
														res.json({});
														connection.release();
													} else if (rows.length != 0) {
														element.weekly_errorcount = rows[0].weekly_errorcount;
													} else {
														element.weekly_errorcount = 0;
													}
													callback(null, index, element);
												});
											}
										],
										function(err, index, element) {
											if (err) {
												res.status(500);
												res.json({});
												connection.release();
											} else {
												projects.push(element);

												//project 리스트가 끝나면 callback
												if (index == (rows.length - 1)) {
													projects.sort(function(a, b) {
														return b.weekly_errorcount - a.weekly_errorcount;
													});

													for(var i in projects){
														projects[i].platform_icon = locale.PLATFORM_ICON[projects[i].platform];
														projects[i].platform = locale.PLATFORM[projects[i].platform];
														projects[i].stage = locale.STAGE[projects[i].stage];
													}
													callback(null, projects);
												}
											}
										});
									}
								}
							});
						}
					], function(err, result) {
						if(err){
							res.status(500);
							res.json({});
							connection.release();
						}else{
							res.status(200);
							res.json(result);
							connection.release();
						}
					});
				} else {
					async.waterfall([
						function(callback) {
							var user_id = req.user.id;
							var queryString = 'select * from projects where owner_uid = ?';
							connection.query(queryString, [user_id], function(err, rows, fields) {
								if (err) {
									res.status(500);
									res.json({});
									connection.release();
								} else {
									var projects = [];
									if(rows.length === 0){
										res.status(200);
										res.json([]);
										connection.release();
									}else {
										for (var i = 0; i < rows.length; i++) {
											var element = {};
											async.waterfall([
												function (callback) {
													element = rows[i];
													delete element.owner_uid;
													callback(null, i, element);
												},

												// weekly error count 정보 추가
												function (index, element, callback) {
													var queryString = 'select count(*) as weekly_errorcount ' +
														'from instances ' +
														'where pid = ? and datetime >= date(now()) - interval 6 day';
													connection.query(queryString, [element.pid], function (err, rows, fields) {
														if (err) {
															res.status(500);
															res.json({});
															connection.release();
														} else if (rows.length != 0) {
															element.weekly_errorcount = rows[0].weekly_errorcount;
														} else {
															element.weekly_errorcount = 0;
														}
														callback(null, index, element);
													});
												}
											],
											function (err, index, element) {
												if (err) {
													res.status(500);
													res.json({});
													connection.release();
												} else {
													projects.push(element);

													//project 리스트가 끝나면 json 보냄
													if (index == (rows.length - 1)) {
														for (var i in projects) {
															projects[i].platform_icon = locale.PLATFORM_ICON[projects[i].platform];
															projects[i].platform = locale.PLATFORM[projects[i].platform];
															projects[i].stage = locale.STAGE[projects[i].stage];
														}
														callback(null, projects);
													}
												}
											});
										}
									}
								}
							});
						}
					], function(err, result) {
						if(err){
							res.status(500);
							res.json({});
							connection.release();
						}else{
							res.status(200);
							res.json(result);
							connection.release();
						}
					});
				}
			});
		}else{
			res.status(401);
			res.json({});
		}
	});

	// 프로젝트 추가
	app.post('/api/project/add', function(req, res, next) {
		res.header('Access-Control-Allow-Origin', '*');
		if(req.user){
			if(req.body.appname && req.body.platform && req.body.category && req.body.stage){
				var name = req.body.appname;
				var platform = parseInt(req.body.platform);
				var category = parseInt(req.body.category);
				var stage = parseInt(req.body.stage);
				var user_id = parseInt(req.user.id);
				var today = new Date();
				var apikey = md5(user_id + name + today + 'honey' + Math.floor(Math.random() * 100)).substr(0, 8);
				var timezone = req.user.timezone;
				var queryString = 'insert into ' +
					'projects (apikey, platform, name, category, stage, timezone, owner_uid) ' +
					'values (?,?,?,?,?,?,?)';
				connectionPool.getConnection(function(err, connection) {
					connection.query(queryString, [apikey, platform, name, category, stage, timezone, user_id], function(err, rows, fields) {
						if (err) {
							res.status(500);
							res.json({});
							connection.release();
						} else {
							var result = {};
							result.project_id = rows.insertId;
							res.status(200);
							res.json(result);
							connection.release();
						}
					});
				});
			}else{
				res.status(400);
				res.json({});
			}
		}else{
			res.status(401);
			res.json({});
		}
	});

	// 프로젝트 정보
	app.get('/api/project/:id', function(req, res, next) {
		res.header('Access-Control-Allow-Origin', '*');
		if(req.user){
			var project_id = req.params.id;
			var queryString = 'select * from projects where pid = ?';
			connectionPool.getConnection(function(err, connection) {
				connection.query(queryString, [project_id], function(err, rows, fields) {
					if (err) {
						res.status(500);
						res.json({});
						connection.release();
					}else if (rows.length === 0) {
						res.status(204);
						res.json({});
						connection.release();
					} else {
						var result = {};
						result = rows[0];
						res.status(200);
						res.json(result);
						connection.release();
					}
				});
			});
		}else{
			res.status(401);
			res.json({});
		}
	});
};