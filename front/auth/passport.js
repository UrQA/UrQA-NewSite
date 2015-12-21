var LocalStrategy = require('passport-local').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var config = require('./config.json');
var mysql = require('mysql');
var connectionPool = mysql.createPool(config);
var check_password = require('./check_password');
var async = require('async');
var jstz = require('jstz');

// Google API Config
var GOOGLE_CLIENT_ID = config.google_auth.client_id;
var GOOGLE_CLIENT_SECRET = config.google_auth.client_secret;
var CALLBACK_URL = config.google_auth.callback_url;

module.exports = function(passport) {

    passport.serializeUser(function(user, done) {
        done(null, user);
    });

    passport.deserializeUser(function(user, done) {
        done(null, user);
    });

    // 회원 가입
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
                        console.log(err);
                        connection.release();
                        return done(null, false, {'loginMessage':'Internal server error'});
                    }


                    var selectSql = 'SELECT * FROM auth_user WHERE username = ?';
                    connection.query(selectSql, [username], function(err,rows,fields){
                        if(err){
                            console.log(err);
                            connection.release();
                            return done(null, false, {'loginMessage':'Internal server error'});
                        }

                        // 이미 가입된 유저인지 확인
                        if(rows.length){
                            connection.release();
                            return done(null, false, {'joinMessage':'That email is already taken.'});
                        }
                        var user = {
                            username: username, // 일반 가입의 경우 username과 email 동일
                            first_name: req.body.join_name,
                            timezone: jstz.determine().name(),
                            password: check_password.hashSync(password) // password 암호화
                        };

                        // auth_user 테이블에 계정 추가
                        var insertSql = "INSERT INTO auth_user ( email, username, first_name, password, date_joined, last_login ) values ( ?, ?, ?, ?, now(), now() )";
                        connection.query(insertSql, [user.username, user.username, user.first_name, user.password], function(err,rows,fields){
                            if(err){
                                console.log(err);
                                connection.release();
                                return done(null, false, {'loginMessage':'Internal server error'});
                            }
                            user.id = rows.insertId;
                            delete user.password;
                            connection.release();
                            return done(null, user);
                        });
                    });
                });
            })
    );

    // 일반 로그인
    passport.use(
        'login',
        new LocalStrategy({
                usernameField : 'login_email',
                passwordField : 'login_password'
            },
            function(username, password, done) {
                connectionPool.getConnection(function(err,connection){
                    if(err){
                        console.log(err);
                        connection.release();
                        return done(null, false, {'loginMessage':'Internal server error'});
                    }
                    async.waterfall([
                        function(callback){
                            var selectSql = 'SELECT * FROM auth_user WHERE username = ?';
                            connection.query(selectSql, [username], function(err,rows,fields){
                                if(err){
                                    console.log(err);
                                    connection.release();
                                    return done(null, false, {'loginMessage':'Internal server error'});
                                }

                                // 계정이 존재하지 않는 경우
                                if(!rows.length){
                                    connection.release();
                                    return done(null, false, {'loginMessage':'Email not found'});
                                }else{
                                    var user = {
                                        id: rows[0].id,
                                        username: rows[0].username,
                                        email: rows[0].email,
                                        first_name: rows[0].first_name,
                                        password: rows[0].password,
                                        timezone: jstz.determine().name(),
                                        is_superuser: rows[0].is_superuser
                                    };

                                    // password 확인
                                    check_password.validatePassword(password, user.password, function(err, result){
                                        if(!result){
                                            connection.release();
                                            return done(null, false, {'loginMessage':'Wrong password'});
                                        }
                                        delete user.password;
                                        callback(null, user);
                                    });
                                }
                            });
                        },
                        function(user, callback){
                            if(err){
                                console.log(err);
                                connection.release();
                                return done(null, false, {'loginMessage':'Internal server error'});
                            }

                            // last_login 서버의 현재 시간으로 갱신
                            var updateSql = 'UPDATE auth_user SET last_login = NOW() WHERE username = ?';
                            connection.query(updateSql, [user.username], function(err, rows, fields){
                                if(err){
                                    console.log(err);
                                    connection.release();
                                    return done(null, false, {'loginMessage':'Internal server error'});
                                }
                                callback(null, user);
                            });
                        }
                    ], function(err, user){
                        if(err){
                            console.log(err);
                            connection.release();
                            return done(null, false, {'loginMessage':'Internal server error'});
                        }
                        connection.release();
                        delete user.password;
                        return done(null, user);
                    });
                });
            })
    );

    /*
        Google 인증 API
     */
    passport.use(new GoogleStrategy({
            clientID: GOOGLE_CLIENT_ID,
            clientSecret: GOOGLE_CLIENT_SECRET,
            callbackURL: CALLBACK_URL
        },
        function(accessToken, refreshToken, profile, done) {
            process.nextTick(function () {
                connectionPool.getConnection(function(err, connection){
                    // google 계정일 경우 username = 'google:' + email
                    var username = 'google:'+profile.emails[0].value;
                    var selectSql = 'SELECT * FROM auth_user WHERE username = ?';
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

                            // Google 로그인이 처음인 경우 auth_user 테이블에 계정 추가
                            if(rows.length === 0){
                                var insertSql = 'INSERT INTO auth_user ( email, username, first_name, password, date_joined, image_path ) values (?,?,?,?,now(),?)';

                                var parameter = [];
                                parameter.push(profile.emails[0].value);
                                parameter.push('google:' + profile.emails[0].value);
                                parameter.push(profile.displayName);
                                parameter.push(check_password.hashSync(profile.id)); // id 암호화하여 password로 지정
                                parameter.push(profile.photos[0].value);

                                connection.query(insertSql, parameter, function(err, rows, fields){
                                   if(err){
                                       console.log(err);
                                       connection.release();
                                       return done(null, false, {'loginMessage': 'Internal server error'});
                                   }else{
                                       var user = {
                                           id: rows.insertId,
                                           username:'google:' + profile.emails[0].value,
                                           email: profile.emails[0].value,
                                           timezone: jstz.determine().name(),
                                           first_name: profile.displayName,
                                           is_superuser: 0
                                       };
                                       callback(null, user);
                                   }
                                });
                            }else{ // Google 로그인이 처음이 아닌 경우 auth_user 테이블에서 계정 확인

                                var user = {
                                    id: rows[0].id,
                                    username:'google:' + profile.emails[0].value,
                                    email: rows[0].email,
                                    timezone: jstz.determine().name(),
                                    first_name: rows[0].first_name,
                                    password: rows[0].password,
                                    is_superuser: rows[0].is_superuser
                                };

                                check_password.validatePassword(profile.id, user.password, function(err, result){
                                    if(!result){
                                        connection.release();
                                        return done(null, false, {'loginMessage':'Wrong password'});
                                    }
                                    delete user.password;
                                    callback(null, user);
                                });
                                callback(null, user);
                            }
                        },
                        function(user, callback){
                            if(err){
                                console.log(err);
                                connection.release();
                                return done(null, false, {'loginMessage':'Internal server error'});
                            }

                            // last_login 현재 서버 시간으로 갱신
                            var updateSql = 'UPDATE auth_user SET last_login = NOW() WHERE username = ?';
                            connection.query(updateSql, [user.username], function(err, rows, fields){
                                if(err){
                                    console.log(err);
                                    connection.release();
                                    return done(null, false, {'loginMessage':'Internal server error'});
                                }
                                callback(null, user);
                            });
                        }
                    ], function(err, user){
                        if(err){
                            console.log(err);
                            connection.release();
                            return done(null, false, {'loginMessage':'Internal server error'});
                        }
                        connection.release();
                        delete user.password;
                        return done(null, user);
                    });
                });
            });
        }
    ));
};