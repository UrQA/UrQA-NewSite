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
    var data = {id:id, section:0};
    res.render('layout/dashboard/layout', getViewContainer("../../dashboard/dashboard", data));
});

router.get('/:id/error', function(req, res) {
    var id = req.params.id;
    var data = {id:id, section:1};
    res.render('layout/dashboard/layout', getViewContainer("../../dashboard/error", data));
});

router.get('/:id/error/:idx?', function(req, res) {
    var id = req.params.id;
    var data = {id:id, section:1};
    res.render('layout/dashboard/layout', getViewContainer("../../dashboard/detail", data));
});

router.get('/:id/statistics', function(req, res) {
    var id = req.params.id;
    var data = {id:id, section:2};
    res.render('layout/dashboard/layout', getViewContainer("../../dashboard/statistics", data));
});

router.get('/:id/setting', function(req, res) {
    var id = req.params.id;
    var data = {id:id, section:3};
    res.render('layout/dashboard/layout', getViewContainer("../../dashboard/setting/general", data));
});

router.get('/:id/setting/viewer', function(req, res) {
    var id = req.params.id;
    var data = {id:id, section:4};
    res.render('layout/dashboard/layout', getViewContainer("../../dashboard/setting/viewer", data));
});

router.get('/:id/setting/symbolicate', function(req, res) {
    var id = req.params.id;
    var data = {id:id, section:5};
    res.render('layout/dashboard/layout', getViewContainer("../../dashboard/setting/symbolicate", data));
});

module.exports = router;
