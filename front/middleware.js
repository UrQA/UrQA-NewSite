var middleware = {
    requireAuthentication: function (req, res, next) {
        if (!new RegExp("^/static|^/user/login").test(req.url) && !req.user) {
            return res.redirect('/user/login');
        }
        next();
    }
}

module.exports = middleware;