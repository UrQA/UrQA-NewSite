module.exports = function (app, passport) {
	app.get('/project', function(req, res, next) {
		if(req.user){
			var data = {'user_id':req.user.id,'user_name':req.user.first_name};
			res.render('projects/index', data);
		}
		else{
			res.redirect('/user/login');
		}
	});
};