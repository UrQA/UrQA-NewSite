var config = require('../../auth/config.json');
var mysql = require('mysql');
var connectionPool = mysql.createPool(config);
var async = require('async');

module.exports = function (app) {
	// 통계 페이지 android sdkversion(osversion)
	app.get('/api/statistics/project/:project_id/osversion', function(req, res) {
		res.header('Access-Control-Allow-Origin', '*');
		if(req.user) {
			var project_id = req.params.project_id;
			var queryString = 'select osversion, count(*) as count ' +
				'from instances ' +
				'where pid = ? and datetime >= date(now()) - interval ? day ' +
				'group by osversion order by count desc';
			var result = {};
			var period = 6;
			connectionPool.getConnection(function (err, connection) {
				connection.query(queryString, [project_id, period], function (err, rows, fields) {
					if (err) {
						res.status(500);
						res.json({});
						connection.release();
					}
					else if (rows.length === 0) {
						res.status(204);
						res.json({});
						connection.release();
					} else {
						result = rows;
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

	// 통계 페이지 country
	app.get('/api/statistics/project/:project_id/country', function(req, res) {
		res.header('Access-Control-Allow-Origin', '*');
		if(req.user) {
			var project_id = req.params.project_id;
			var period = 6;
			var queryString = 'select country, count(*) as count ' +
				'from instances ' +
				'where pid = ? and datetime >= date(now()) - interval ? day ' +
				'group by country order by count desc limit 10';
			var result = {};
			connectionPool.getConnection(function (err, connection) {
				connection.query(queryString, [project_id, period], function (err, rows, fields) {
					if (err) {
						res.status(500);
						res.json({});
						connection.release();
					}
					else if (rows.length === 0) {
						res.status(204);
						res.json({});
						connection.release();
					} else {
						result = rows;
						res.status(200);
						res.json(rows);
						connection.release();
					}
				});
			});
		}else{
			res.status(401);
			res.json({});
		}
	});

	// 통계 페이지 device (상위 9개)
	app.get('/api/statistics/project/:project_id/device', function(req, res) {
		res.header('Access-Control-Allow-Origin', '*');
		if(req.user) {
			var project_id = req.params.project_id;
			var period = 6;
			var queryString = 'select device, count(*) as count ' +
				'from instances ' +
				'where pid = ? and datetime >= date(now()) - interval ? day ' +
				'group by device order by count desc limit 9';
			var result = {};
			connectionPool.getConnection(function (err, connection) {
				connection.query(queryString, [project_id, period], function (err, rows, fields) {
					if (err) {
						res.status(500);
						res.json({});
						connection.release();
					}
					else if (rows.length === 0) {
						res.status(204);
						res.json({});
						connection.release();
					} else {
						result = rows;
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

	// 통계 페이지 errorclassname
	app.get('/api/statistics/project/:project_id/errorclassname', function(req, res) {
		res.header('Access-Control-Allow-Origin', '*');
		if(req.user) {
			var project_id = req.params.project_id;
			var period = 6;
			var queryString = 'select if(errors.errorclassname = \"\", \"unknown\", errors.errorclassname) as errorclassname, count(errors.rank) as count ' +
				'from instances join errors on instances.iderror = errors.iderror ' +
				'where instances.pid = ? and instances.datetime >= date(now()) - interval ? day ' +
				'group by errorclassname order by count desc limit 10';
			var result = {};
			connectionPool.getConnection(function (err, connection) {
				connection.query(queryString, [project_id, period], function (err, rows, fields) {
					if (err) {
						res.status(500);
						res.json({});
						connection.release();
					}
					else if (rows.length === 0) {
						res.status(204);
						res.json({});
						connection.release();
					} else {
						result = rows;
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

	// 통계 페이지 lastactivity
	app.get('/api/statistics/project/:project_id/lastactivity', function(req, res) {
		res.header('Access-Control-Allow-Origin', '*');
		if(req.user) {
			var project_id = req.params.project_id;
			var period = 6;
			var queryString = 'select if(lastactivity = \"\", \"unknown\", lastactivity) as lastactivity, count(*) as count ' +
				'from instances ' +
				'where pid = ? and datetime >= date(now()) - interval ? day ' +
				'group by lastactivity order by count desc limit 10';
			var result = {};
			connectionPool.getConnection(function (err, connection) {
				connection.query(queryString, [project_id, period], function (err, rows, fields) {
					if (err) {
						res.status(500);
						res.json({});
						connection.release();
					}
					else if (rows.length === 0) {
						res.status(204);
						res.json({});
						connection.release();
					} else {
						result = rows;
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

	// 통계 페이지 error appversion & osversion
	app.get('/api/statistics/project/:project_id/error_version', function(req, res) {
		res.header('Access-Control-Allow-Origin', '*');
		if(req.user) {
			var project_id = req.params.project_id;
			var period = 6;
			var result = {};
			result.osversion = [];
			result.appversion = [];
			result.data = [];
			var queryString = 'select osversion from instances where pid = ? and datetime >= date(now()) - interval ? day group by osversion';

			connectionPool.getConnection(function (err, connection) {
				connection.query(queryString, [project_id, period], function (err, rows, fields) {
					if (err) {
						res.status(500);
						res.json({});
						connection.release();
					}
					else if (rows.length === 0) {
						res.status(204);
						res.json({});
						connection.release();
					} else {
						for (var i = 0; i < rows.length; i++) {
							result.osversion.push(rows[i].osversion);
							async.waterfall([
								function (callback) {
									var index = i;
									var osversion = rows[i].osversion;
									var queryString = 'select i2.appversion, if(i1.count is null, 0, i1.count) as count ' +
										'from (select osversion, appversion, count(*) as count from instances where pid = ? and osversion = ? and datetime >= date(now()) - interval ? day group by appversion) as i1 ' +
										'right outer join (select appversion, if(count(*) != 0, count(*), 0) as count from instances where pid = ? and datetime >= date(now()) - interval ? day group by appversion order by count desc limit 5) as i2 ' +
										'on i1.appversion = i2.appversion';
									connection.query(queryString, [project_id, osversion, period, project_id, period], function (err, rows, fields) {
										if(err){
											res.status(500);
											res.json({});
											connection.release();
										}else{
											var arr = [];
											arr.push(osversion);
											for (var j = 0; j < rows.length; j++) {
												if (j > 10) {
													break;
												}
												arr.push(rows[j].count);
												if (index === 0) {
													result.appversion.push(rows[j].appversion);
												}
											}
											result.data.push(arr);
											callback(null, index, result);
										}
									});
								}

							], function (err, index, result) {
								if (err) {
									res.status(500);
									res.json({});
									connection.release();
								}else if (index === rows.length - 1) {
									res.status(200);
									res.json(result);
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