var express = require('express');
var router = express.Router();
var getViewContainer = function(defaultPath, data) {
    return {
        mainContainer: defaultPath + "/index",
        scriptContainer: defaultPath + "/scripts",
        data: data
    };
};

/* GET users listing. */
router.get('/:id', function(req, res) {
    var id = req.params.id;
    var data = {id:id};
    res.render('layout/dashboard/layout', getViewContainer("../../dashboard/dashboard",data));
});

router.get('/error', function(req, res) {
    res.render('layout/dashboard/layout', getViewContainer("../../dashboard/error"));
});

router.get('/error/:idx?', function(req, res) {
    var id = req.params.id;
    res.render('layout/dashboard/layout', getViewContainer("../../dashboard/detail"));
});

router.get('/statistics', function(req, res) {
    res.render('layout/dashboard/layout', getViewContainer("../../dashboard/statistics"));
});


router.get('/setting', function(req, res) {
    var id = req.params.id;
    res.render('layout/dashboard/layout', getViewContainer("../../dashboard/setting/general"));
});

router.get('/setting/symbolicate', function(req, res) {
    var id = req.params.id;
    res.render('layout/dashboard/layout', getViewContainer("../../dashboard/setting/symbolicate"));
});

router.get('/setting/viewer', function(req, res) {
    var id = req.params.id;
    res.render('layout/dashboard/layout', getViewContainer("../../dashboard/setting/viewer"));
});

module.exports = router;
