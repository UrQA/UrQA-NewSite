var express = require('express');
var router = express.Router();

router.get('/sample1', function(req, res) {
  var object = require('./test.json');
  res.json(object);
});

router.get('/sample2', function(req, res) {
  var object = require('./test2.json');
  res.json(object);
});

router.get('/sample3', function(req, res) {
  var object = require('./test3.json');
  res.json(object);
});

router.get('/sample4', function(req, res) {
  var object = require('./test4.json');
  res.json(object);
});

module.exports = router;
