fs = require("fs");

var requireDir = function (app, routes, passport) {
	var stat = fs.statSync(routes);
	if (stat.isFile()) {
		var routeName = routes.substr(0, routes.indexOf('.'));
		require('./' + routeName)(app, passport);
	} else {
		fs.readdirSync(routes).forEach(function (subFile) {
			var routeName = subFile.substr(0, subFile.indexOf('.'));
			requireDir(app, routes + "/" + subFile, passport);
		});
	}
};

module.exports = function(app, routes, passport) {
	return requireDir(app, routes, passport);
};
