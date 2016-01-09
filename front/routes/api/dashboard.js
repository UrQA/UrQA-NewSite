var locale = require('../../public/app/locale/en.json');
var config = require('../../auth/config.json');
var mysql = require('mysql');
var connectionPool = mysql.createPool(config);
var async = require('async');


module.exports = function (app) {
	app.get('/api/dashboard/project/:id/sdk', function(req, res, next) {
		res.header('Access-Control-Allow-Origin', '*');
		if(req.user){
			var project_id = req.params.id;
			var period = 6;
			var queryString = 'select osversion, count(*) as count ' +
				'from instances ' +
				'where pid = ? and datetime >= date(now()) - interval ? day ' +
				'group by osversion order by count(*) desc limit 1';
			connectionPool.getConnection(function(err, connection) {
				connection.query(queryString, [project_id, period], function(err, rows, fields) {
					var result = {};
					if (err) {
						res.status(500);
						res.json({});
						connection.release();
					}else{
						if (rows.length === 0) {
							result.data = 'unknown';
						} else {
							result.data = rows[0].osversion;
						}
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

	app.get('/api/dashboard/project/:id/weekly/error', function(req, res, next) {
		res.header('Access-Control-Allow-Origin', '*');
		if(req.user){
			var project_id = req.params.id;
			var period = 6;
			var queryString = 'select count(*) as weekly_errorcount ' +
				'from instances ' +
				'where pid = ? and datetime >= date(now()) - interval ? day';

			connectionPool.getConnection(function(err, connection) {
				connection.query(queryString, [project_id, period], function(err, rows, fields) {
					var result = {};
					if (err) {
						res.status(500);
						res.json({});
						connection.release();
					}else{
						result.data = rows[0].weekly_errorcount;
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

	app.get('/api/dashboard/project/:id/weekly/session', function(req, res, next) {
		res.header('Access-Control-Allow-Origin', '*');
		if(req.user){
			var project_id = req.params.id;
			var period = 6;
			var queryString = 'select sum(appruncount) as weekly_sessioncount ' +
				'from appruncount2 ' +
				'where pid = ? and datetime >= date(now()) - interval ? day';
			connectionPool.getConnection(function(err, connection) {
				connection.query(queryString, [project_id, period], function(err, rows, fields) {
					var result = {};
					if (err) {
						res.status(500);
						res.json({});
						connection.release();
					}else{
						if (rows[0].weekly_sessioncount === null) {
							result.data = 0;
						} else {
							result.data = rows[0].weekly_sessioncount;
						}
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

	app.get('/api/dashboard/project/:id/daily/error', function(req, res, next) {
		res.header('Access-Control-Allow-Origin', '*');
		if(req.user){
			var project_id = req.params.id;
			var period = 6;
			var queryString = 'select (date(CONVERT_TZ(datetime, \'UTC\', ?)) + interval 1 day) as datetime, count(*) as error_count ' +
				'from instances ' +
				'where pid = ? and date(datetime) >= date(now()) - interval ? day and date(datetime) < date(now()) + interval 1 day ' +
				'group by date(datetime)';

			connectionPool.getConnection(function(err, connection) {
				connection.query(queryString, [req.session.timezone, project_id, period], function(err, rows, fields) {
					var result = {};
					var data = [];

					if (err) {
						res.status(500);
						res.json({});
						connection.release();
					}else{
						for (var i = 0; i < rows.length; i++) {
							var element = [];
							var datetime = rows[i].datetime;
							element.push(datetime.getTime());
							element.push(rows[i].error_count);
							data.push(element);
						}
						result.data = data;
						result.timezone = req.session.timezone;
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

	app.get('/api/dashboard/project/:id/weekly/rank', function(req, res, next) {
		res.header('Access-Control-Allow-Origin', '*');
		if(req.user){
			var project_id = req.params.id;
			var period = 6;
			var queryString = 'select errors.rank as rank, count(errors.rank) as count ' +
				'from instances join errors on instances.iderror = errors.iderror ' +
				'where instances.pid = ? and instances.datetime >= date(now()) - interval ? day ' +
				'group by rank';

			connectionPool.getConnection(function(err, connection) {
				connection.query(queryString, [project_id, period], function(err, rows, fields) {
					var result = [];
					if (err) {
						res.status(500);
						res.json({});
						connection.release();
					}else{
						if (rows.length === 0) {
							res.status(204);
							res.json({});
							connection.release();
						} else {
							for(var i in rows){
								var element = {};
								element.rank = locale.RANK[rows[i].rank];
								element.count = rows[i].count;
								result.push(element);
							}
							res.status(200);
							res.json(result);
							connection.release();
						}
					}
				});
			});
		}else{
			res.status(401);
			res.json({});
		}
	});

	app.get('/api/dashboard/project/:id/errors/tranding', function(req, res, next) {
		res.header('Access-Control-Allow-Origin', '*');
		if(req.user){
			var project_id = req.params.id;
			var period = 6;
			var queryString = 'select iderror, rank, numofinstances, errorname, errorclassname, linenum, status, DATE_FORMAT(CONVERT_TZ(lastdate, \'UTC\', ?), \'%Y-%m-%d\') as lastdate ' +
				'from errors ' +
				'where pid = ? and (status = 0 or status = 1) and lastdate >= date(now()) - interval ? day ' +
				'order by (case rank when 2 then 1 when 3 then 2 when 1 then 3 when 0 then 4 else 9 end), numofinstances desc limit 15';

			connectionPool.getConnection(function(err, connection) {
				connection.query(queryString, [req.session.timezone, project_id, period], function(err, rows, fields) {
					if (err) {
						res.status(500);
						res.json({});
						connection.release();
					}

					var errors = [];
					var size = 0;

					if (rows.length === 0) {
						res.status(204);
						res.json({});
						connection.release();
					} else {
						for (var i = 0; i < rows.length; i++) {
							var data = {};
							async.waterfall([
								function(callback) {
									data.ID = rows[i].iderror;
									data["0"] = locale.RANK[rows[i].rank];
									data["1"] = rows[i].numofinstances;
									data["2"] = rows[i].errorname + '<br>' + rows[i].errorclassname + ':' + rows[i].linenum;
									data["4"] = rows[i].lastdate;
									callback(null, i, data);
								},

								//tag 정보 추가
								function(index, data, callback) {
									var queryString = 'select tag from tags where iderror = ?';
									connection.query(queryString, [data.ID], function(err, rows, fields) {
										if (err) {
											res.status(500);
											res.json({});
											connection.release();
										}else {
											var str = "";
											for (var j = 0; j < rows.length; j++) {
												if (j != 0) {
													str += ',';
												}
												str += rows[j].tag;
											}
											data["3"] = str;
											callback(null, index, data);
										}
									});
								}
							],
							function(err, index, data) {
								if (err) {
									res.status(500);
									res.json({});
									connection.release();
								}

								errors.push(data);
								size++;

								if (index == (rows.length - 1)) {
									res.status(200);
									res.json({ sEcho:0, iTotalRecords: 60, iTotalDisplayRecords: size, errorData:errors });
									connection.release();
								}
							});
						}
					}
				});
			});
		}else{
			res.status(401);
			res.json({});
		}
	});

	app.get('/api/dashboard/project/:id/errors/latest', function(req, res, next) {
		res.header('Access-Control-Allow-Origin', '*');
		if(req.user){
			var project_id = req.params.id;
			var period = 6;
			var queryString = 'select iderror, rank, numofinstances, errorname, errorclassname, linenum, status, DATE_FORMAT(CONVERT_TZ(lastdate, \'UTC\', ?), \'%Y-%m-%d\') as lastdate ' +
				'from errors ' +
				'where pid = ? and lastdate >= date(now()) - interval ? day ' +
				'order by lastdate desc, (case rank when 2 then 1 when 3 then 2 when 1 then 3 when 0 then 4 else 9 end), numofinstances desc limit 15';

			connectionPool.getConnection(function(err, connection) {
				connection.query(queryString, [req.session.timezone, project_id, period], function(err, rows, fields) {
					if (err) {
						res.status(500);
						res.json({});
						connection.release();
					}

					var errors = [];
					var size = 0;

					if (rows.length === 0) {
						res.status(204);
						res.json({});
						connection.release();
					} else {
						for (var i = 0; i < rows.length; i++) {
							var data = {};
							async.waterfall([
								function(callback) {
									data.ID = rows[i].iderror;
									data["0"] = locale.RANK[rows[i].rank];
									data["1"] = rows[i].numofinstances;
									data["2"] = rows[i].errorname + '<br>' + rows[i].errorclassname + ':' + rows[i].linenum;
									data["4"] = rows[i].lastdate;
									callback(null, i, data);
								},

								//tag 정보 추가
								function(index, data, callback) {
									var queryString = 'select tag from tags where iderror = ?';
									connection.query(queryString, [data.ID], function(err, rows, fields) {
										if (err) {
											res.status(500);
											res.json({});
											connection.release();
										}else {
											var str = "";
											for (var j = 0; j < rows.length; j++) {
												if (j != 0) {
													str += ',';
												}
												str += rows[j].tag;
											}
											data["3"] = str;
											callback(null, index, data);
										}
									});
								}
							],
							function(err, index, data) {
								if (err) {
									res.status(500);
									res.json({});
									connection.release();
								}

								errors.push(data);
								size++;

								if (index == (rows.length - 1)) {
									res.status(200);
									res.json({ sEcho:0, iTotalRecords: 60, iTotalDisplayRecords: size, errorData:errors });
									connection.release();
								}
							});
						}
					}
				});
			});
		}else{
			res.status(401);
			res.json({});
		}
	});
};