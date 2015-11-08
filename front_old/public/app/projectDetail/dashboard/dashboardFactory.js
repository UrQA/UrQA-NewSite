angular.module("app")
.factory('DashboardErrorPieGraphService', ['$resource', function($resource) {
    return function(apikey) {
        return $resource('/ajax/dashboard/pie');
    };
}])
.factory('DashboardErrorDailyService', ['$resource', function($resource) {
    return function(apikey) {
        return $resource('/ajax/dashboard/daily');
    };
}])
.factory('DashBoardInfoService', ['$resource', function($resource){
    return function(apikey) {
      return $resource('/ajax/dashboard/info');
    };

}]);