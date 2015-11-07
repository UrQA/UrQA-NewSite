var express = require('express');
var request = require('request');
var router = express.Router();

// Project List
router.get('/', function(req, res, next) {
    res.render('projects/index');
});

// Dashboard
router.get('/v/:id', function(req, res, next) {
    request('https://honeyqa.io:8080/project/' + req.params.id, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            res.status(200);
            res.render('projects/detail/layout', {project:body});
        }else{
            res.status(500);
            res.render('error', project);
        }
    })
});

router.get('/v/:id/errors', function(req, res, next) {
    request('https://honeyqa.io:8080/project/' + req.params.id, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            res.status(200);
            res.render('projects/detail/layout', {project:body});
        }else{
            res.status(500);
            res.render('error', project);
        }
    })
});

module.exports = router;
