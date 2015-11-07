angular.module("app")
.factory('StatCache', ['$cacheFactory', function($cacheFactory) {
	return $cacheFactory('Stat-Cache');
}])
.factory('StatDauService', ['$resource', function($resource) {
	return function(apikey) {
		return $resource('/ajax/stat/dau/:days');
	};
}])
.factory('StatCrashRateService', ['$resource', function($resource) {
	return function(apikey) {
		return $resource('/ajax/stat/crash/:days');
	};
}])
.factory('StatOsVersionService', ['$resource', function($resource) {
	return function(apikey) {
		return $resource('/ajax/stat/os/:days');
	};
}])
.factory('StatActivityService', ['$resource', function($resource) {
	return function(apikey) {
		return $resource('/ajax/stat/activity/:days');
	};
}])
.factory('StatDeviceService', ['$resource', function($resource) {
	return function(apikey) {
		return $resource('/ajax/stat/device/:days');
	};
}])
.factory('StatWorldeService', ['$resource', function($resource) {
	return function(apikey) {
		return $resource('/ajax/stat/world/:days');
	};
}])
.factory('StatVersionService', ['$resource', function($resource) {
	return function(apikey) {
		return $resource('/ajax/stat/version/:days');
	};
}])
.factory('StatClassService', ['$resource', function($resource) {
	return function(apikey) {
		return $resource('/ajax/stat/class/:days');
	};
}]);