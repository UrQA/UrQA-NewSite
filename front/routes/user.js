module.exports = function (app, passport) {
    app.get('/user/login', function(req, res, next) {
        res.render('user/login');
    });

    app.post('/user/login', passport.authenticate('login', {
	   	successRedirect: '/project',
        failureRedirect: '/user/login',
        failureFlash: true })
    );

    app.get('/user/logout', function(req, res, next){
        req.logout();
        res.redirect('/');
    });

    app.get('/user/join', function(req, res, next) {
        res.render('user/join');
    });

    app.post('/user/join', passport.authenticate('join', {
	   	successRedirect: '/project',
        failureRedirect: '/user/join',
        failureFlash: true })
    );

    app.get('/user/auth/google',
        passport.authenticate('google', {
		   	scope: [
            	'https://www.googleapis.com/auth/userinfo.profile',
            	'https://www.googleapis.com/auth/userinfo.email',
        ]}));

    app.get('/user/auth/google/callback',
        passport.authenticate('google', {
		   	successRedirect: '/project',
            failureRedirect: '/login' ,
            failureFlash: true })
	);
};
