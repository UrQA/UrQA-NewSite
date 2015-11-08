var app = angular.module("app");

app.config(function ($stateProvider) {
        $stateProvider.state("projects", {
                url: "/",
                template: "<ui-view />",
                abstract: true,
                data: { title: [] }
            })
            .state("projects.list",{
                url: "projects",
                templateUrl: "/static/app/projects/projects.list.html",
                controller: "ProjectCtrl",
                resolve: {data: function ($stateParams, ProjectModel) {
                    return $stateParams.data || ProjectModel.query().$promise;
                } }
            })
            .state("projects.add", {
                url: "add",
                templateUrl: "/static/app/projects/projects.edit.html",
                controller: "ProjectEditCtrl"
            });
    })

    .factory("ProjectModel", function ($resource) {
        return $resource("/api/projects/list");
    })

    .controller("ProjectCtrl", function ($scope, $window, data) {
        $scope.go = function (apikey) {
            $window.location.href = "/" + apikey;
        };
        $scope.list = data;
    })

    .controller("ProjectEditCtrl", function ($scope, $modal) {

    });