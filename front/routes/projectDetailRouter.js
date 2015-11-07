var express = require('express');
var router = express.Router();
var getViewContainer = function(defaultPath) {
    return {
        mainContainer: defaultPath + "/index",
        scriptContainer: defaultPath + "/scripts"
    };
};

/* GET users listing. */
router.get('/*', function(req, res) {
    res.render('layout/ProjectDetail/layout');
});



module.exports = router;
