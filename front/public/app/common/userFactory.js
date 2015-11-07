angular.module("app")
.factory('UserInfoService', ['$resource', function($resource) {
	return function() {
		return $resource('/ajax/user-sample');
	};
}]);
