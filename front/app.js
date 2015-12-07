//https://gist.github.com/branneman/8048520
global.rootRequire = function(name) {
    return require(__dirname + '/' + name);
}

var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var express = require('express');
var favicon = require('serve-favicon');
var flash = require('express-flash');
var local = require('./auth/local');
var logger = require('morgan');
var passport = require('passport');
require('./auth/passport')(passport);
var path = require('path');
var session  = require('express-session');

var routes = rootRequire('routes/index');
var apiRoutes = rootRequire('routes/api');
var dashboardRoutes = rootRequire('routes/dashboard');
var projectRoutes = rootRequire('routes/project');
var userRoutes = rootRequire('routes/user');

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

// required for passport
app.use(session({
    secret: local.passport_secret,
    resave: true,
    saveUninitialized: true
} )); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

app.use('/static', express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/api', apiRoutes);
app.use('/dashboard', dashboardRoutes);
app.use('/project', projectRoutes);
app.use('/user', userRoutes(passport));

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
    console.log(err.message);
    res.send({
        message: err.message,
        error: {}
    });
});


module.exports = app;
