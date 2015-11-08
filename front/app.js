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

var routes = rootRequire('routes/index')
var sampleAjaxRoutes = rootRequire('routes/sample/ajax');;
var users = rootRequire('routes/users');
var projectsRoutes = rootRequire('routes/projects');

var dashboardRoutes = rootRequire('routes/dashboard');

var app = express();
app.use(function(req, res, next) {
    res.locals.baseUrl = req.protocol + '://' + req.get('host');
    res.locals.resourceUrl = function(path) {
        return res.locals.baseUrl + "/static" + path;
    };

    res.locals.getUrl = function(path) {
        return res.locals.baseUrl + path;
    }

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

app.use('/', routes);
app.use('/users', users);
app.use('/projects', projectsRoutes);
app.use('/dashboard', dashboardRoutes);
app.use('/ajax', sampleAjaxRoutes);

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
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

module.exports = app;
