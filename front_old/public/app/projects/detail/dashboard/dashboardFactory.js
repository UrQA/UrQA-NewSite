angular.module("app")
    .factory('DashboardErrorPieGraphService', ['$resource', function($resource) {
        return function(apiKey) {
            return $resource('/ajax/dashboard/pie');
        };
    }])
    .factory('DashboardErrorDailyService', ['$resource', function($resource) {
        return function(id) {
            return $resource('https://honeyqa.io:8080/project/:id/weekly_appruncount2', {id:id});
        };
    }])
    .factory('DashboardBugService', ['$resource', function($resource){
        return function(id) {
            return $resource('https://honeyqa.io:8080/project/:id/weekly_errorcount', {id:id});
        };
    }])
    .factory('DashboardUserService', ['$resource', function($resource){
        return function(id) {
            return $resource('https://honeyqa.io:8080/project/:id/weekly_sessioncount', {id:id});
        };
    }])
    .factory('DashboardCountryService', ['$resource', function($resource){
        return function(id) {
            return $resource('https://honeyqa.io:8080/project/:id/most/errorbycountry', {id:id});
        };
    }])
    .factory('DashboardSDKService', ['$resource', function($resource){
        return function(id) {
            return $resource('https://honeyqa.io:8080/project/:id/most/errorbysdkversion', {id:id});
        };
    }]);