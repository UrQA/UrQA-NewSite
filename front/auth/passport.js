var LocalStrategy = require('passport-local').Strategy;

var mysql = require('mysql');
var dbConfig = require('./database');
var connectionPool = mysql.createPool(dbConfig);
var check_password = require('./check_password');
var async = require('async');

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
                                var user = {};
                                user.id = rows[0].id;
                                user.email = rows[0].email;
                                user.first_name = rows[0].first_name;
                                user.password = rows[0].password;
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
};