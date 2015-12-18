var config = require('../auth/config.json');
var mysql = require('mysql');
var connectionPool = mysql.createPool(config);
var async = require('async');

var getViewContainer = function(defaultPath, data, user) {
	return {
		mainContainer: defaultPath + "/index",
		scriptContainer: defaultPath + "/scripts",
		data: data,
		user_id: user.id,
		user_name: user.first_name
	};
};
module.exports = function (app) {
	app.get('/dashboard/:id', function(req, res) {
		if(req.user){
			async.waterfall([
				// 대시보드 진입 시 프로젝트 timezone 세팅
				function(callback){
					var project_id = req.params.id;
					var queryString = 'select * from projects where pid = ?';
					connectionPool.getConnection(function(err, connection){
						connection.query (queryString, [project_id], function(err, rows, fields) {
							if(err){
								callback(err);
								connection.release();
							}else{
								req.session.timezone = rows[0].timezone;
								callback(null);
							}
						});
					});
				}
			], function(err){
				if(err){
					res.status(500);
					res.redirect('/user/login');
				}else{
					var data = {id:req.params.id, section:0};
					res.render('layout/dashboard/layout', getViewContainer("../../dashboard/dashboard", data, req.user));
				}
			});
		}else{
			res.redirect('/user/login');
		}
	});

	app.get('/dashboard/:id/error', function(req, res) {
		if(req.user){
			var data = {id:req.params.id, section:1};
			res.render('layout/dashboard/layout', getViewContainer("../../dashboard/error", data, req.user));
		}else{
			res.redirect('/user/login');
		}
	});

	app.get('/dashboard/:id/error/:idx', function(req, res) {
		if(req.user){
			var data = {id:req.params.id, section:1, eid: req.params.idx};
			res.render('layout/dashboard/layout', getViewContainer("../../dashboard/detail", data, req.user));
		}else{
			res.redirect('/user/login');
		}
	});

	app.get('/dashboard/:id/statistics', function(req, res) {
		if(req.user){
			var data = {id:req.params.id, section:2};
			res.render('layout/dashboard/layout', getViewContainer("../../dashboard/statistics", data, req.user));
		}else{
			res.redirect('/user/login');
		}
	});

	app.get('/dashboard/:id/setting', function(req, res) {
		if(req.user){
			var data = {id:req.params.id, section:3};
			res.render('layout/dashboard/layout', getViewContainer("../../dashboard/setting/general", data, req.user));
		}else{
			res.redirect('/user/login');
		}
	});

	app.get('/dashboard/:id/setting/viewer', function(req, res) {
		if(req.user){
			var data = {id:req.params.id, section:4};
			res.render('layout/dashboard/layout', getViewContainer("../../dashboard/setting/viewer", data, req.user));
		}else{
			res.redirect('/user/login');
		}
	});

	app.get('/dashboard/:id/setting/symbolicate', function(req, res) {
		if(req.user){
			var data = {id:req.params.id, section:5};
			res.render('layout/dashboard/layout', getViewContainer("../../dashboard/setting/symbolicate", data, req.user));
		}else{
			res.redirect('/user/login');
		}
	});

	app.get('/dashboard/:id/setting/proguard', function(req, res) {
		if(req.user){
			var data = {id:req.params.id, section:5};
			res.render('layout/dashboard/layout', getViewContainer("../../dashboard/setting/proguard", data));
		}else{
			res.redirect('/user/login');
		}
	});
};