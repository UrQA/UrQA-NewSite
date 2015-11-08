//https://gist.github.com/branneman/8048520
global.rootRequire = function(name) {
    return require(__dirname + '/' + name);
}

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var _ = require('underscore');

var UserProjectCache = rootRequire('service/userProjectsService');
var routes = rootRequire('routes/index')
var sampleAjaxRoutes = rootRequire('routes/sample/ajax');;
var users = rootRequire('routes/users');
var projectsRoutes = rootRequire('routes/projects');
var api = rootRequire('routes/api');
var dashboardRoutes = rootRequire('routes/projectDetailRouter');


var API_KEY_REGEX = /\/([0-9A-Za-z]{8})/;

var userProjectCache = new UserProjectCache();

var app = express();
app.use(function(req, res, next) {
    res.locals.baseUrl = req.protocol + '://' + req.get('host');
    res.locals.resourceUrl = function(path) {
        return res.locals.baseUrl + "/static" + path;
    };
    res.locals.getUrl = function(path) {
        return res.locals.baseUrl + path;
    };
    //디폴트로 설정해야 하는 요소들은 여기에서 처리
    next();
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
app.use(favicon(__dirname + '/public/images/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/static', express.static(path.join(__dirname, 'public')));
app.use('/node_modules', express.static(path.join(__dirname, 'node_modules')));
app.use('/static/bower_components', express.static(path.join(__dirname, 'bower_components')));

app.use('/', routes);
app.use('/api', api);
app.use('/users', users);
app.use('/projects', projectsRoutes);
app.use('/ajax', sampleAjaxRoutes);

//apikey
app.use(API_KEY_REGEX, function(req, res, next){

    var project;
    res.locals.apikey = req.params[0];
    project = userProjectCache.getProjectInfo(1, req.params[0]);

    if(_.isNull(project)) {
        res.send(403, '사용 권한 없음'); //권한 없음 에러
    } else {
        res.locals.project = project;
        next();
    }


});
app.use(API_KEY_REGEX, dashboardRoutes);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        console.log(err.message);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user

module.exports = app;
