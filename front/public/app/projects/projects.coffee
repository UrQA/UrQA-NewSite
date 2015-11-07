app = angular.module('app')
app.constant('NAV_SIDE', [
  {
    name: 'NAV_SIDE.PROJECTS'
    path: 'projects.list'
    icon: 'fa-archive'
  }
  {
    name: 'NAV_SIDE.ADD_PROJECTS'
    path: 'projects.add'
    icon: 'fa-plus-circle'
  }
  {
    name: 'NAV_SIDE.TUTORIAL.TITLE'
    path: 'tutorial'
    icon: 'fa-question-circle'
    menu: [
      {
        name: 'NAV_SIDE.TUTORIAL.ANDROID'
        path: 'tutorial.android'
      }
      {
        name: 'NAV_SIDE.TUTORIAL.IOS'
        path: 'tutorial.ios'
      }
      {
        name: 'NAV_SIDE.TUTORIAL.UNITY'
        path: 'tutorial.unity'
      }
      {
        name: 'NAV_SIDE.TUTORIAL.CORDOVA'
        path: 'tutorial.cordova'
      }
    ]
  }
]).controller 'NavSideCtrl', ($scope, $state, NAV_SIDE) ->
  $scope.menu = NAV_SIDE
app.config(($stateProvider, $urlRouterProvider) ->

  $stateProvider.state('projects',
    url: '/'
    template: '<ui-view />'
    abstract: true
    data: title: [])
  .state('projects.list',
    url: 'projects/{page}'
    templateUrl: '/static/app/projects/projects.list.html'
    controller: 'ProjectCtrl'
    resolve: data: ($stateParams, ProjectModel) ->
      page = if $stateParams.page? and $stateParams.page != "" then $stateParams.page else 1
      ProjectModel.get({page:page}).$promise

  ).state 'projects.add',
    url: 'projects/add'
    templateUrl: '/static/app/projects/projects.edit.html'
    controller: 'ProjectEditCtrl'

  $urlRouterProvider.when('/projects','/projects/1')

).factory('ProjectModel', ($resource) ->
  $resource '/ajax/projects/:page'
).controller('ProjectCtrl', ($scope, $stateParams, $window, $state, data) ->


  $scope.go = (apikey) ->
    $window.location.href = '/' + apikey

  $scope.list = data.results
  $scope.currentPage = if  $stateParams.page? and $stateParams.page != "" then $stateParams.page else 1
  $scope.totalItems = data.count
  $scope.pageItems = 8

  $scope.setPage = () ->
    $state.go 'projects.list', {page: $scope.currentPage}



).controller 'ProjectEditCtrl', ($scope, $modal) ->

