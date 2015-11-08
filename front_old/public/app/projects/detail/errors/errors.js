angular.module("app")
    .config(function ($stateProvider) {

    })
    .controller("ErrorsLocController", function($scope, PROJECT_INFO){
        $scope.project = JSON.parse(PROJECT_INFO);
    })
    .controller('FilterController', function($scope, ErrorsFilterService, ErrorClassFilterService) {
        var dateOption, today;
        today = new Date();
        dateOption = {
            maxDate: new Date()
        };
        $scope.dateOption = {
            maxDate: new Date(),
            minDate: new Date(+today - (1000 * 3600 * 24 * 30)),
            dateFormat: "yy-mm-dd"
        };
        $scope.filterData = {};
        $scope.filterData.tag = [];
        $scope.filterData.appVersion = [];
        $scope.filterData.osVersion = [];
        $scope.filterData["class"] = [];
        $scope.filterData.startAt = "";
        $scope.filterData.endAt = "";
        $scope.filterData.rank = {
            unhandled: true,
            "native": true,
            critical: true,
            major: true,
            minor: true
        };
        $scope.filterData.status = {
            newError: true,
            openError: true,
            fixedError: true,
            ignoreError: true
        };
        $scope.rankAll = true;
        $scope.statusAll = true;
        $scope.appVersions = [];
        $scope.osVersions = [];
        $scope.tags = [];
        $scope["class"] = [];
        ErrorsFilterService('test').get().$promise.then(function(data) {
            $scope.appVersions = data['appVersion'];
            $scope.osVersions = data['osVersion'];
            return $scope.tags = data['tags'];
        });
        ErrorClassFilterService('apikey').get().$promise.then(function(data) {
            return $scope.classList = data["class"];
        });
        $scope.clickAllRank = function() {
            return $scope.filterData.rank = _.mapValues($scope.filterData.rank, function() {
                return $scope.rankAll;
            });
        };
        $scope.clickAllStatus = function() {
            return $scope.filterData.status = _.mapValues($scope.filterData.status, function() {
                return $scope.statusAll;
            });
        };
        return $scope.clickPanel = function($event) {
            var $current, el;
            $current = $($event.target);
            el = $current.parents('.panel').children('.panel-body');
            if ($current.hasClass('fa-chevron-down')) {
                $current.removeClass('fa-chevron-down').addClass('fa-chevron-up');
                el.slideUp(200);
            } else {
                $current.removeClass('fa-chevron-up').addClass('fa-chevron-down');
                el.slideDown(200);
            }
        };
    });
