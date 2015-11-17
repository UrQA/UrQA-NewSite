var LocalStrategy = require('passport-local').Strategy;

var mysql = require('mysql');
var bcrypt = require('bcrypt-nodejs');
var dbConfig = require('./database');
var connectionPool = mysql.createPool(dbConfig);

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
                    var selectSql = 'SELECT * FROM userh WHERE email = ?';
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
                            password: bcrypt.hashSync(password, null, null),
                        };
                        var insertSql = "INSERT INTO userh ( email, username, first_name, password ) values (?,?,?,?)";
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
                    var selectSql = 'SELECT id,first_name,email,password FROM userh WHERE email = ?';
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
                        bcrypt.compare(password, user.password, function(err, result){
                            delete user.password;
                            if(!result){
                                return done(null, false, {'loginMessage':'Wrong password'});
                            }
                            var projectSql = 'SELECT pid FROM projects WHERE owner_uid = ?';
                            connection.query(projectSql, [user.id], function(err, rows, fields){
                                if(err){
                                    connection.release();
                                    return done(null, false, {'loginMessage':'Internal server error'});
                                }
                                if(!rows.length){
                                    var project = {};
                                    user.project = project;
                                }else{
                                    var project = {};
                                    for(var i=0;i<rows.length;i++){
                                        project[rows[i].pid] = true;
                                    }
                                    user.project = project;
                                }
                                connection.release();
                                return done(null, user);
                            });
                        });
                    });
                });
            })
    );
};
