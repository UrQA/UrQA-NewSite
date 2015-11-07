var express = require('express');
var router = express.Router();

router.get('/login', function(req, res, next) {
    res.render('user/login');
});

router.post('/login', function(req, res, next) {
    res.redirect('/projects');
});

router.get('/join', function(req, res, next) {
    res.render('user/join');
});

module.exports = router;
