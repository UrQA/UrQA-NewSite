var pbkdf2 = require('pbkdf2-sha256');

const HASHSTR = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
const ITER = 12000;
const BEFOREITER = 'pbkdf2_sha256';

/* *
 * key: originPassword
 * string: `pdkdf2-sha256` password
 * */

exports.validatePassword = function (key, string, callback) {
    var parts = string.split('$');
    var iterations = parts[1];
    var salt = parts[2];
    console.log(pbkdf2(key, new Buffer(salt), iterations, 32).toString('base64'));
    console.log(parts[3]);
    callback(null, pbkdf2(key, new Buffer(salt), iterations, 32).toString('base64') === parts[3]);
};

exports.hashSync = function(key){
    var result = "";
    var salt = makeSalt();

    result = BEFOREITER + '$' + ITER + '$' + salt + '$';
    result += pbkdf2(key, new Buffer(salt), ITER, 32).toString('base64');

    return result;
}

function makeSalt(){
    var salt = "";
    for (var i = 0; i < 32; i++) {
        salt += HASHSTR[Math.floor((Math.random() * 62))];
    }
    return salt;
}