module.exports = function (app, passport) {
	app.get('/project', function(req, res, next) {
		var data = {'user_id':req.user.id,'user_name':req.user.first_name};
		res.render('projects/index', data);
	});
};