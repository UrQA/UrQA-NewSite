var request = require('request');
var locale = require('../../public/app/locale/en.json');
var config = require('../../auth/config.json');
var mysql = require('mysql');
var connectionPool = mysql.createPool(config);
var async = require('async');


function checkAll(d){
	var l = d.toLowerCase();
	if(l === '' || l === 'all')
		return true;
	return false;
}

module.exports = function (app) {

	app.get('/api/errors/filter/:pid', function(req, res, next) {
		var period = 6;
		connectionPool.getConnection(function(err, connection) {
			if(err){
				res.status(500);
				res.json({});
				connection.release();
			}else{
				async.waterfall([
					function(callback) {
						var queryString = 'select appversion, count(*) as count from instances where pid = ? and datetime >= date(now()) - interval ? day group by appversion order by count desc limit 5';
						var project_id = req.params.pid;
						var result = {};

						connection.query(queryString, [project_id, period], function(err, rows, fields) {
							if(err){
								res.status(500);
								res.json({});
								connection.release();
							}else{
								result.filter_appversions = rows;
								callback(null, result);
							}
						});
					},

					function(result, callback) {
						var queryString = 'select device, count(*) as count from instances where pid = ? and datetime >= date(now()) - interval ? day group by device order by count desc limit 5';
						var project_id = req.params.pid;

						connection.query(queryString, [project_id, period], function(err, rows, fields) {
							if(err){
								res.status(500);
								res.json({});
								connection.release();
							}else {
								result.filter_devices = rows;
								callback(null, result);
							}
						});
					},

					function(result, callback) {
						var queryString = 'select osversion, count(*) as count from instances where pid = ? and datetime >= date(now()) - interval ? day group by osversion order by count desc limit 5';
						var project_id = req.params.pid;

						connection.query(queryString, [project_id, period], function(err, rows, fields) {
							if(err){
								res.status(500);
								res.json({});
								connection.release();
							}else {
								result.filter_sdkversions = rows;
								callback(null, result);
							}
						});
					},

					function(result, callback) {
						var queryString = 'select country, count(*) as count from instances where pid = ? and datetime >= date(now()) - interval ? day group by country order by count desc limit 5';
						var project_id = req.params.pid;

						connection.query(queryString, [project_id, period], function(err, rows, fields) {
							if(err){
								res.status(500);
								res.json({});
								connection.release();
							}else {
								result.filter_countries = rows;
								callback(null, result);
							}
						});
					},

					function(result, callback) {
						var queryString = 'select errorclassname, count(*) as count from errors where pid = ? and lastdate >= date(now()) - interval ? day group by errorclassname order by count desc limit 5';
						var project_id = req.params.pid;

						connection.query(queryString, [project_id, period], function(err, rows, fields) {
							if(err){
								res.status(500);
								res.json({});
								connection.release();
							}else {
								result.filter_classes = rows;
								callback(null, result);
							}
						});
					},

					function(result, callback) {
						var queryString = 'select tag from tags where pid = ? group by tag';
						var project_id = req.params.pid;

						connection.query(queryString, [project_id], function(err, rows, fields) {
							if(err){
								res.status(500);
								res.json({});
								connection.release();
							}else {
								result.filter_tags = rows;
								callback(null, result);
							}
						});
					}

				], function(err, result) {
					if(err){
						res.status(500);
						res.json({});
						connection.release();
					}else {
						res.status(200);
						res.json(result);
						connection.release();
					}
				});
			}
		});
	});

	app.get('/api/errors/:pid', function(req, res, next) {
		var project_id = req.params.pid;

		// appversion / osversion / country
		var data = {};
		var dataArr = [];
		var raw = '';
		var rawArr;
		if(checkAll(req.query.country)){
			dataArr = ['all'];
		}else{
			raw = req.query.country;
			rawArr = raw.split(',');
			for(var i=0;i<rawArr.length-1;i++){
				if(checkAll(rawArr[i])){
					dataArr = ['all'];
					break;
				}
				dataArr.push(rawArr[i]);
			}
		}
		data['country'] = dataArr;
		dataArr = [];
		if(checkAll(req.query.appversion)){
			dataArr = ['all'];
		}else{
			raw = req.query.appversion;
			rawArr = raw.split(',');
			for(var i=0;i<rawArr.length-1;i++){
				if(checkAll(rawArr[i])){
					dataArr = ['all'];
					break;
				}
				dataArr.push(rawArr[i]);
			}
		}
		data['appversion'] = dataArr;
		dataArr = [];
		if(checkAll(req.query.osversion)){
			dataArr = ['all'];
		}else{
			raw = req.query.osversion;
			rawArr = raw.split(',');
			for(var i=0;i<rawArr.length-1;i++){
				if(checkAll(rawArr[i])){
					dataArr = ['all'];
					break;
				}
				dataArr.push(rawArr[i]);
			}
		}
		data['osversion'] = dataArr;
		dataArr = [];
		if(checkAll(req.query.rank)){
			dataArr = ['all'];
		}else{
			raw = req.query.rank;
			rawArr = raw.split(',');
			for(var i=0;i<rawArr.length-1;i++){
				if(checkAll(rawArr[i])){
					dataArr = ['all'];
					break;
				}
				dataArr.push(rawArr[i]);
			}
		}
		data['rank'] = dataArr;
		dataArr = [];
		if(checkAll(req.query.status)){
			dataArr = ['all'];
		}else{
			raw = req.query.status;
			rawArr = raw.split(',');
			for(var i=0;i<rawArr.length-1;i++){
				if(checkAll(rawArr[i])){
					dataArr = ['all'];
					break;
				}
				dataArr.push(rawArr[i]);
			}
		}
		data['status'] = dataArr;
		data['start'] = Number(req.query.datestart);
		data['end'] = Number(req.query.dateend);

		connectionPool.getConnection(function(err, connection) {
			if(err){

			}
			async.waterfall([
				function(callback) {
					var queryString = 'select iderror from errors where pid = ? ';

					// period query
					if (data.start > 1) {
						queryString += 'and lastdate <= date(now()) - interval ' + (data.start - 1) + ' day ';
					}
					if (data.end > 1) {
						queryString += 'and lastdate >= date(now()) - interval ' + (data.end - 1) + ' day ';
					} else {
						queryString += 'and date(lastdate) >= date(now())';
					}
					// instance table query

					connection.query(queryString, [project_id], function(err, rows, fields) {
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
							callback(null, data, rows);
						}
					});
				},
				function(body, errors, callback) {
					var queryString = 'select iderror, rank, numofinstances, errorname, errorclassname, linenum, status, DATE_FORMAT(CONVERT_TZ(lastdate, \'UTC\', ?), \'%Y-%m-%d\') as lastdate from errors where iderror in (';
					for (var i = 0; i < errors.length; i++) {
						if (i != 0) {
							queryString += ', ';
							queryString += errors[i].iderror;
						} else {
							queryString += errors[i].iderror;
						}
					}
					queryString += ')';

					// error table query

					queryString += 'order by (case rank when 2 then 1 when 3 then 2 when 1 then 3 when 0 then 4 else 9 end), status, numofinstances desc limit 50';
					connection.query(queryString, [req.session.timezone], function(err, rows, fields) {
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
							var result = [];
							var size = 0;
							for(var i in rows){
								var data = {};
								var tags = '';
								data["ID"] = rows[i].iderror;
								data["0"] = locale.RANK[rows[i].rank];
								data["1"] = rows[i].numofinstances;
								data["2"] = rows[i].errorname + '<br>' + rows[i].errorclassname + ':' + rows[i].linenum;
								data["4"] = locale.Status[rows[i].status];
								data["5"] = rows[i].lastdate;
								result.push(data);
								size++;
							}
							callback(null, result, size);
						}
					});
				}
			], function(err, result, size) {
				if (err) {
					res.status(500);
					res.json({});
					connection.release();
				} else {
					for(var i = 0; i < result.length; i++){
						async.waterfall([
							function(callback){
								callback(null, i);
							},
							function(index, callback){
								var tags = '';
								var queryString = 'select tag from tags where iderror = ?';
								connection.query(queryString, [result[index].ID], function(err, rows, fields) {
									if (err) {
										res.status(500);
										res.json({});
										connection.release();
									}else {
										var tags = "";
										for (var j = 0; j < rows.length; j++) {
											if (j != 0) {
												tags += ',';
											}
											tags += rows[j].tag;
										}
										callback(null, result, tags, index);
									}
								});
							}
						], function(err, result, tags, index){
							if(err){
								res.status(500);
								res.json({});
								connection.release();
							}else{
								result[index]["3"] = tags;
								if (index == (result.length - 1)){
									res.status(200);
									res.json({sEcho:0, iTotalRecords: 60, iTotalDisplayRecords: size, errorData:result});
									connection.release();
								}
							}
						});
					}
				}
			});
		});
	});


	app.get('/api/errors/:pid/latest', function(req, res, next) {
		var project_id = req.params.pid;

		// appversion / osversion / country
		var data = {};
		var dataArr = [];
		var raw = '';
		var rawArr;
		if(checkAll(req.query.country)){
			dataArr = ['all'];
		}else{
			raw = req.query.country;
			rawArr = raw.split(',');
			for(var i=0;i<rawArr.length-1;i++){
				if(checkAll(rawArr[i])){
					dataArr = ['all'];
					break;
				}
				dataArr.push(rawArr[i]);
			}
		}
		data['country'] = dataArr;
		dataArr = [];
		if(checkAll(req.query.appversion)){
			dataArr = ['all'];
		}else{
			raw = req.query.appversion;
			rawArr = raw.split(',');
			for(var i=0;i<rawArr.length-1;i++){
				if(checkAll(rawArr[i])){
					dataArr = ['all'];
					break;
				}
				dataArr.push(rawArr[i]);
			}
		}
		data['appversion'] = dataArr;
		dataArr = [];
		if(checkAll(req.query.osversion)){
			dataArr = ['all'];
		}else{
			raw = req.query.osversion;
			rawArr = raw.split(',');
			for(var i=0;i<rawArr.length-1;i++){
				if(checkAll(rawArr[i])){
					dataArr = ['all'];
					break;
				}
				dataArr.push(rawArr[i]);
			}
		}
		data['osversion'] = dataArr;
		dataArr = [];
		if(checkAll(req.query.rank)){
			dataArr = ['all'];
		}else{
			raw = req.query.rank;
			rawArr = raw.split(',');
			for(var i=0;i<rawArr.length-1;i++){
				if(checkAll(rawArr[i])){
					dataArr = ['all'];
					break;
				}
				dataArr.push(rawArr[i]);
			}
		}
		data['rank'] = dataArr;
		dataArr = [];
		if(checkAll(req.query.status)){
			dataArr = ['all'];
		}else{
			raw = req.query.status;
			rawArr = raw.split(',');
			for(var i=0;i<rawArr.length-1;i++){
				if(checkAll(rawArr[i])){
					dataArr = ['all'];
					break;
				}
				dataArr.push(rawArr[i]);
			}
		}
		data['status'] = dataArr;
		data['start'] = Number(req.query.datestart);
		data['end'] = Number(req.query.dateend);

		connectionPool.getConnection(function(err, connection) {
			if(err){

			}
			async.waterfall([
				function(callback) {
					var queryString = 'select iderror from errors where pid = ? ';

					// period query
					if (data.start > 1) {
						queryString += 'and lastdate <= date(now()) - interval ' + (data.start - 1) + ' day ';
					}
					if (data.end > 1) {
						queryString += 'and lastdate >= date(now()) - interval ' + (data.end - 1) + ' day ';
					} else {
						queryString += 'and date(lastdate) >= date(now())';
					}
					// instance table query

					connection.query(queryString, [project_id], function(err, rows, fields) {
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
							callback(null, data, rows);
						}
					});
				},
				function(body, errors, callback) {
					var queryString = 'select iderror, rank, numofinstances, errorname, errorclassname, linenum, status, DATE_FORMAT(CONVERT_TZ(lastdate, \'UTC\', ?), \'%Y-%m-%d\') as lastdate from errors where iderror in (';
					for (var i = 0; i < errors.length; i++) {
						if (i != 0) {
							queryString += ', ';
							queryString += errors[i].iderror;
						} else {
							queryString += errors[i].iderror;
						}
					}
					queryString += ')';

					// error table query

					queryString += 'order by lastdate desc, (case rank when 2 then 1 when 3 then 2 when 1 then 3 when 0 then 4 else 9 end), numofinstances desc limit 50';
					connection.query(queryString, [req.session.timezone], function(err, rows, fields) {
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
							var result = [];
							var size = 0;
							for(var i in rows){
								var data = {};
								var tags = '';
								data["ID"] = rows[i].iderror;
								data["0"] = locale.RANK[rows[i].rank];
								data["1"] = rows[i].numofinstances;
								data["2"] = rows[i].errorname + '<br>' + rows[i].errorclassname + ':' + rows[i].linenum;
								data["4"] = locale.Status[rows[i].status];
								data["5"] = rows[i].lastdate;
								result.push(data);
								size++;
							}
							callback(null, result, size);
						}
					});
				}
			], function(err, result, size) {
				if (err) {
					res.status(500);
					res.json({});
					connection.release();
				} else {
					for(var i = 0; i < result.length; i++){
						async.waterfall([
							function(callback){
								callback(null, i);
							},
							function(index, callback){
								var tags = '';
								var queryString = 'select tag from tags where iderror = ?';
								connection.query(queryString, [result[index].ID], function(err, rows, fields) {
									if (err) {
										res.status(500);
										res.json({});
										connection.release();
									}else {
										var tags = "";
										for (var j = 0; j < rows.length; j++) {
											if (j != 0) {
												tags += ',';
											}
											tags += rows[j].tag;
										}
										callback(null, result, tags, index);
									}
								});
							}
						], function(err, result, tags, index){
							if(err){
								res.status(500);
								res.json({});
								connection.release();
							}else{
								result[index]["3"] = tags;
								if (index == (result.length - 1)){
									res.status(200);
									res.json({sEcho:0, iTotalRecords: 60, iTotalDisplayRecords: size, errorData:result});
									connection.release();
								}
							}
						});
					}
				}
			});
		});
	});

};