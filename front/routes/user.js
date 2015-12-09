var express = require('express');
var router = express.Router();

module.exports = function(passport){
    router.get('/login', function(req, res, next) {
        if(!req.user){
            res.render('user/login');
        }else{
            res.redirect('/project');
        }
    });

    router.post('/login', passport.authenticate('login', { successRedirect: '/project',
        failureRedirect: '/user/login',
        failureFlash: true })
    );

    router.get('/logout', function(req, res, next){
        req.logout();
        res.redirect('/');
    });

    router.get('/join', function(req, res, next) {
        res.render('user/join');
    });

    router.post('/join', passport.authenticate('join', { successRedirect: '/project',
        failureRedirect: '/user/join',
        failureFlash: true })
    );

    router.get('/auth/google',
        passport.authenticate('google', { scope: [
            'https://www.googleapis.com/auth/userinfo.profile',
            'https://www.googleapis.com/auth/userinfo.email'
        ]}));

    router.get('/auth/google/callback',
        passport.authenticate('google', { successRedirect: '/project',
            failureRedirect: '/login' ,
            failureFlash: true }));

    return router;
}

