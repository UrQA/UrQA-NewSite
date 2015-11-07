app = angular.module('app', [
  'ui.router'
  'ngResource'
  'ui.bootstrap'
  'pascalprecht.translate'
])
app.config(($locationProvider) ->
  $locationProvider.html5Mode true
).config(($translateProvider, L10N_EN) ->
  $translateProvider.translations 'en', L10N_EN
  $translateProvider.preferredLanguage 'en'
).run ($rootScope, $state) ->
  $rootScope.$state = $state

