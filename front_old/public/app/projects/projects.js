var app = angular.module("app");

app.constant("NAV_SIDE", [{
        name: "NAV_SIDE.PROJECTS",
        path: "projects.list",
        icon: "fa-archive"
    }, {
        name: "NAV_SIDE.ADD_PROJECTS",
        path: "projects.add",
        icon: "fa-plus-circle"
    }, {
        name: "NAV_SIDE.TUTORIAL.TITLE",
        path: "tutorial",
        icon: "fa-question-circle",
        menu: [{
            name: "NAV_SIDE.TUTORIAL.ANDROID",
            path: "tutorial.android"
        },{
            name: "NAV_SIDE.TUTORIAL.IOS",
            path: "tutorial.ios"
        }, {
            name: "NAV_SIDE.TUTORIAL.UNITY",
            path: "tutorial.unity"
        }, {
            name: "NAV_SIDE.TUTORIAL.CORDOVA",
            path: "tutorial.cordova"
        }]
    }])

    .controller("NavSideCtrl", function ($scope, $state, NAV_SIDE) {
        $scope.menu = NAV_SIDE;
    });

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