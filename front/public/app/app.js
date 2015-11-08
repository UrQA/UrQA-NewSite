var app = angular.module("app",[
    'ui.router',
    'ngResource',
    'ui.bootstrap',
    'pascalprecht.translate',
    'ui.select',
    'ui.date',
    'ngSanitize'
]);

app.config(function ($locationProvider) {
        $locationProvider.html5Mode(true);
    })

    .filter("propsFilter", function() {
        return function(items, props) {
            var out;
            out = [];
            if (angular.isArray(items)) {
                items.forEach(function(item) {
                    var i, itemMatches, keys, len, prop, text;
                    itemMatches = false;
                    keys = Object.keys(props);
                    for (i = 0, len = keys.length; i < len; i++) {
                        prop = keys[i];
                        text = props[prop];
                        if (item[prop].toString().toLowerCase().indexOf(text) !== -1) {
                            itemMatches = true;
                            break;
                        }
                    }
                    if (itemMatches) {
                        return out.push(item);
                    }
                });
            } else {
                out = items;
            }
            return out;
        }
    })

    .config(function ($translateProvider, L10N_EN) {
        $translateProvider.translations("en", L10N_EN);

        $translateProvider.preferredLanguage("en");
    })

    .run(function ($rootScope, $state) {
        $rootScope.$state = $state;
    });
