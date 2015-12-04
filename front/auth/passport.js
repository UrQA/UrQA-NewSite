var LocalStrategy = require('passport-local').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var config = require('./config.json');

var mysql = require('mysql');
var dbConfig = require('./config.json');
var connectionPool = mysql.createPool(dbConfig);
var check_password = require('./check_password');
var async = require('async');

var GOOGLE_CLIENT_ID = config.google_auth.client_id;
var GOOGLE_CLIENT_SECRET = config.google_auth.client_secret;

module.exports = function(passport) {

    passport.serializeUser(function(user, done) {
        done(null, user);
    });

    passport.deserializeUser(function(user, done) {
        done(null, user);
    });
    passport.use(
        'join',
        new LocalStrategy({
                usernameField : 'join_email',
                passwordField : 'join_password',
                passReqToCallback: true
            },
            function(req, username, password, done) {
                connectionPool.getConnection(function(err,connection){
                    if(err){
                        return done(null, false);
                    }
                    var selectSql = 'SELECT * FROM auth_user WHERE email = ?';
                    connection.query(selectSql, [username], function(err,rows,fields){
                        if(err){
                            connection.release();
                            return done(null, false);
                        }
                        if(rows.length){
                            connection.release();
                            return done(null, false, {'joinMessage':'That email is already taken.'});
                        }
                        var u = {
                            email: username,
                            first_name: req.body.join_name,
                            password: check_password.hashSync(password),
                        };
                        var insertSql = "INSERT INTO auth_user ( email, username, first_name, password, date_joined ) values (?,?,?,?,now())";
                        connection.query(insertSql, [u.email, u.email, u.first_name, u.password], function(err,rows,fields){
                            if(err){
                                connection.release();
                                return done(null, false);
                            }
                            u.id = rows.insertId;
                            delete u.password;
                            connection.release();
                            return done(null, u);
                        });
                    });
                });
            })
    );

    passport.use(
        'login',
        new LocalStrategy({
                usernameField : 'login_email',
                passwordField : 'login_password'
            },
            function(username, password, done) {
                connectionPool.getConnection(function(err,connection){
                    if(err){
                        return done(null, false);
                    }
                    async.waterfall([
                        function(callback){
                            var selectSql = 'SELECT id,first_name,email,password FROM auth_user WHERE email = ?';
                            connection.query(selectSql, [username], function(err,rows,fields){
                                if(err){
                                    connection.release();
                                    return done(null, false);
                                }
                                if(!rows.length){
                                    connection.release();
                                    return done(null, false, {'loginMessage':'Email not found'});
                                }
                                var user = {
                                    id: rows[0].id,
                                    email: rows[0].email,
                                    first_name: rows[0].first_name,
                                    password: rows[0].password
                                };
                                check_password.validatePassword(password, user.password, function(err, result){
                                    delete user.password;
                                    if(!result){
                                        return done(null, false, {'loginMessage':'Wrong password'});
                                    }
                                    callback(null, user);
                                });
                            });
                        },
                        function(user, callback){
                            if(err){
                                callback(err, '#2');
                            }

                            var updateSql = 'UPDATE auth_user SET last_login = NOW() WHERE email = ?';
                            connection.query(updateSql, [user.email], function(err,rows,fields){
                                if(err){
                                    connection.release();
                                    return done(null, false);
                                }
                                delete user.password;
                                callback(null, user);
                            });
                        }
                    ], function(err, result){
                        if(err){
                            console.log(err);
                            connection.release();
                            return done(null, false, {'loginMessage':'Internal server error'});
                        }
                        connection.release();
                        return done(null, result);
                    });
                });
            })
    );

    passport.use(new GoogleStrategy({
            clientID: GOOGLE_CLIENT_ID,
            clientSecret: GOOGLE_CLIENT_SECRET,
            callbackURL: "http://localhost:3000/users/auth/google/callback"
        },
        function(accessToken, refreshToken, profile, done) {
            // asynchronous verification, for effect...
            process.nextTick(function () {
                console.log(profile);
                connectionPool.getConnection(function(err, connection){
                    var selectSql = 'SELECT * FROM auth_user WHERE username = ?';
                    var username = 'google:'+profile.emails[0].value;
                    async.waterfall([
                        function(callback){
                            connection.query(selectSql, [username], function(err, rows, fields){
                                if(err){
                                    console.log(err);
                                    connection.release();
                                    return done(null, false, {'loginMessage': 'Internal server error'});
                                }
                                callback(null, rows);
                            });
                        },
                        function(rows, callback){
                            if(rows.length === 0){
                                var insertSql = 'INSERT INTO auth_user ( email, username, first_name, password, date_joined, image_path ) values (?,?,?,?,now(),?)';
                                var parameter = [];
                                parameter.push(profile.emails[0].value);
                                parameter.push('google:' + profile.emails[0].value);
                                parameter.push(profile.displayName);
                                parameter.push(check_password.hashSync(profile.id));
                                parameter.push(profile.photos[0].value);
                                connection.query(insertSql, parameter, function(err, rows, fields){
                                   if(err){
                                       console.log(err);
                                       connection.release();
                                       return done(null, false, {'loginMessage': 'Internal server error'});
                                   }else{
                                       var user = {
                                           id: rows.insertId,
                                           email: profile.emails[0].value,
                                           first_name: profile.displayName
                                       };
                                       callback(null, user);
                                   }
                                });
                            }else{
                                var user = {
                                    id: rows[0].id,
                                    email: rows[0].email,
                                    first_name: rows[0].first_name,
                                    password: rows[0].password
                                };
                                check_password.validatePassword(profile.id, user.password, function(err, result){
                                    delete user.password;
                                    if(!result){
                                        return done(null, false, {'loginMessage':'Wrong password'});
                                    }
                                    callback(null, user);
                                });
                                callback(null, user);
                            }
                        },
                        function(user, callback){
                            if(err){
                                callback(err, '#2');
                            }

                            var updateSql = 'UPDATE auth_user SET last_login = NOW() WHERE email = ?';
                            connection.query(updateSql, [user.email], function(err,rows,fields){
                                if(err){
                                    connection.release();
                                    return done(null, false);
                                }
                                delete user.password;
                                callback(null, user);
                            });
                        }
                    ], function(err, result){
                        if(err){
                            console.log(err);
                            connection.release();
                            return done(null, false, {'loginMessage':'Internal server error'});
                        }
                        connection.release();
                        return done(null, result);
                    });
                });
            });
        }
    ));
};