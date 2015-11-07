var app = angular.module("app",[
	"ui.router",
	"ngResource",
	"ui.bootstrap",
	"pascalprecht.translate"]);

app.config(function ($locationProvider) {
	$locationProvider.html5Mode(true);
})

.config(function ($translateProvider, L10N_EN) {
	$translateProvider.translations("en", L10N_EN);

	$translateProvider.preferredLanguage("en");
})


.run(function ($rootScope, $state) {
	$rootScope.$state = $state;
});
