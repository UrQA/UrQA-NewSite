module.exports = function (app) {
	app.get('/', function(req, res, next) {
		res.redirect('/user/login');
	});
};
