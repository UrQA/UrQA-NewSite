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

router.get('/user-sample', function(req, res){
  var object = require('./user-sample.json');
  res.json(object);
});


router.get('/dashboard/pie', function(req, res){
  var object = require('./dashboard/graph/error-pie.json');
  res.json(object);
});

router.get('/dashboard/daily', function(req, res){
  var object = require('./dashboard/graph/daily-error.json');
  res.json(object);
});

router.get('/dashboard/info', function(req, res){
  var object = require('./dashboard/dashboard.json');
  res.json(object);
});

router.get('/stat/dau/:days', function(req, res){
  var object = require('./stat/dailyActiveUser.json');
  if(req.param('days') === '7') {
    object =  require('./stat/7/dailyActiveUser.json');
  }
  res.json(object);
});
router.get('/stat/crash/:days', function(req, res) {
  var object = require('./stat/crashRate.json');
  if(req.param('days') === '7') {
    object =  require('./stat/7/crashRate.json');
  }
  res.json(object);
});
router.get('/stat/os/:days', function(req, res) {
  var object = require('./stat/osVersionList.json');
  if(req.param('days') === '7') {
    object =  require('./stat/7/osVersionList.json');
  }
  res.json(object);
});
router.get('/stat/activity/:days', function(req, res) {
  var object = require('./stat/errorActivityList.json');
  if(req.param('days') === '7') {
    object =  require('./stat/7/errorActivityList.json');
  }
  res.json(object);
});
router.get('/stat/device/:days', function(req, res) {
  var object = require('./stat/deviceErrorRate.json');
  if(req.param('days') === '7') {
    object =  require('./stat/7/deviceErrorRate.json');
  }
  res.json(object);
});
router.get('/stat/world/:days', function(req, res) {
  var object = require('./stat/worldMap.json');
  if(req.param('days') === '7') {
    object =  require('./stat/7/worldMap.json');
  }
  res.json(object);
});
router.get('/stat/version/:days', function(req, res) {
  var object = require('./stat/versionErrorRate.json');
  if(req.param('days') === '7') {
    object =  require('./stat/7/versionErrorRate.json');
  }
  res.json(object);
});
router.get('/stat/class/:days', function(req, res) {
  var object = require('./stat/classErrorRate.json');
  if(req.param('days') === '7') {
    object =  require('./stat/7/classErrorRate.json');
  }
});
router.get('/projects', function(req, res){
  var object = require('./projects.json');
  res.json(object);
});

router.get('/projects/:page', function(req, res){
  var object = require('./projects.1.json');
  if(req.param('page') === '2') {
    object = require('./projects.2.json');
  } else if(req.param('page') === '3'){
    object = require('./projects.3.json');
  }
  res.json(object);
});

router.get('/errors/filter', function(req, res){
  var object = require('./filterInfo.json');
  res.json(object);
});

router.get('/errors/filter/class', function(req, res){
  var object = require('./filterClassInfo.json');
  res.json(object);
});

module.exports = router;
