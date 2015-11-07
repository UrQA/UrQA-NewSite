var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});

router.post('/login', function(req, res, next) {
    console.log('err');
    res.redirect('/projects');
});

router.get('/join', function(req, res, next) {
    res.render('user/join');
});

module.exports = router;
