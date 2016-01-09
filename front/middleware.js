var middleware = {
    requireAuthentication: function (req, res, next) {
        if (!req.user) {
            if (new RegExp('^/api').test(req.url)) {
                return res.json({
                    status: 401
                });
            } else if (!new RegExp("^/static|^/user").test(req.url)) {
                return res.redirect('/user/login');
            }
        } else {
            if (new RegExp('^/api').test(req.url)) {
                res.header('Access-Control-Allow-Origin', '*');
            } else if (new RegExp("^/user").test(req.url)) {
                return res.redirect('/project');
            }
        }
        next();
    }
}

module.exports = middleware;