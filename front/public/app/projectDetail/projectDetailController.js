/**
 * Created by karuana on 15. 7. 4..
 */
var app = angular.module("app");


app.constant("DETAIL_NAV_SIDE", [{
			name: "DETAIL_NAV_SIDE.DASHBOARD",
			path: "detail.dashboard",
			icon: "fa-dashboard"
		}, {
			name: "DETAIL_NAV_SIDE.ERRORS",
			path: "detail.errors",
			icon: "fa-laptop"
		}, {
			name: "DETAIL_NAV_SIDE.STATISTICS",
			path: "detail.statistics",
			icon: "fa-book"
		},
			{
				name: "DETAIL_NAV_SIDE.SETTINGS.TITLE",
				icon: "fa-bullhorn",
				menu: [{
					name: "DETAIL_NAV_SIDE.SETTINGS.GENERAL",
					path: "detail.general",
					parent: "DETAIL_NAV_SIDE.SETTINGS"
				},{
					name: "DETAIL_NAV_SIDE.SETTINGS.VIEWER",
					path: "detail.viewer",
					parent: "DETAIL_NAV_SIDE.SETTINGS"
				}, {
					name: "DETAIL_NAV_SIDE.SETTINGS.SYMBOLICATE",
					path: "detail.symbolicate",
					parent: "DETAIL_NAV_SIDE.SETTINGS"
				}]
			}])
		.config(function ($stateProvider, PROJECT_INFO) {
			var apiKey = PROJECT_INFO.key;
			$stateProvider.state("detail", {
						url: "^projects/:id",
						template: "<ui-view />",
						abstract: true
					})
					.state("detail.dashboard", {
						url: apiKey,
                        controller: "DetailViewTestController",
						templateUrl: "/static/app/projectDetail/dashboard/template.html"
					})
					.state("detail.errors",{
						url: apiKey + "/errors",
                        controller: "DetailViewTestController",
						templateUrl: "/static/app/projectDetail/errors/template.html"
					})
					.state("detail.statistics", {
						url: apiKey + "/statistics",
                        controller: "DetailViewTestController",
						templateUrl: "/static/app/projectDetail/statistics/template.html"
					})
					.state("detail.general", {
						url: apiKey + "/setting",
                        controller: "DetailViewTestController",
						templateUrl: "/static/app/projectDetail/setting/general/template.html"
					})
					.state("detail.viewer", {
						url: apiKey + "/setting/viewer",
                        controller: "DetailViewTestController",
						templateUrl: "/static/app/projectDetail/setting/viewer/template.html"
					})
					.state("detail.symbolicate", {
						url: apiKey + "/setting/symbolicate",
                        controller: "DetailViewTestController",
						templateUrl: "/static/app/projectDetail/setting/symbolicate/template.html"
					});
		})
		.controller("DetailNavSideCtrl", function ($scope, DETAIL_NAV_SIDE) {
			$scope.menu = DETAIL_NAV_SIDE;
			$scope.activeMenu = "detail.dashboard";
			$scope.$on('$stateChangeSuccess', function(event, toState){
				$scope.activeMenu = toState.name;
			});

			$scope.clickMenu = function(target) {
				$scope.activeMenu = target;
			};

			$scope.hasPathParm = function(param) {
				return (param !== undefined) && (param !== null);
			};
		})
		.controller("DetailViewController", function($scope, PROJECT_INFO){
			$scope.project = PROJECT_INFO;
		});