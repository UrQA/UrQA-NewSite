var express = require('express');
var request = require('request');
var router = express.Router();

router.get('/projects/list', function(req, res, next) {
    request('https://honeyqa.io:8080/projects/2', function (error, response, body) {
        if (!error && response.statusCode == 200) {
            res.status(200);
            console.log(JSON.parse(body).projects);
            res.json(JSON.parse(body).projects);
        }else{
            res.status(500);
            res.json('{}');
        }
    })
});

module.exports = router;
