angular.module('app')
    .factory('ErrorsFilterService', [
        '$resource', function($resource) {
            return function(apikey) {
                return $resource('/ajax/errors/filter');
            };
        }])
    .factory("ErrorClassFilterService", [
        '$resource', function($resource) {
            return function(apikey) {
                return $resource('/ajax/errors/filter/class');
            };
        }
    ]);