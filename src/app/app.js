angular.module('mosaink', [
  'templates-app',
  'ngAnimate',
  'ngRoute',
  'ngCookies',

  'ui.bootstrap.modal',
  'mgcrea.ngStrap',
  'angulartics',
  'angulartics.google.analytics',
  'angulartics.mixpanel',

  'mosaink.constant',
  'mosaink.translation',
  'mosaink.common'
])
.config(function ($routeProvider, $locationProvider, settings, translationsProvider) {
  settings.translationModules.forEach(function (translationModule) {
    translationsProvider.register(translationModule);
  });

  $routeProvider
    .when('/search', {
      templateUrl: 'common/templates/search.html',
      controller: 'SearchCtrl'
    })
    .when('/access_token=:instagram_token', {
      templateUrl: 'common/templates/my-mosaink.html',
      controller: 'InstagramConnectedCtrl'
    })
    .when('/tos', {
      templateUrl: 'common/templates/tos.html',
      controller: 'MainCtrl'
    })
    .when('/privacy-policy', {
      templateUrl: 'common/templates/privacy-policy.html',
      controller: 'MainCtrl'
    })
    .when('/:username', {
      templateUrl: 'common/templates/preview.html',
      controller: 'PreviewCtrl'
    })
    .otherwise({
      redirectTo: '/search'
    });

    // Remove #-sign
    /*$locationProvider.html5Mode({
      enabled: true,
      requireBase: false
    });
    $locationProvider.hashPrefix('!');*/
})
.config(['$analyticsProvider',
  function($analyticsProvider) {
    $analyticsProvider.registerEventTrack(function(action, properties) {
      /*console.log("$analyticsProvider eventTrack:");
      console.log("Action: ", action);
      console.log("Properies", properties);*/

      mixpanel.track(action, properties);
    });

    $analyticsProvider.registerPageTrack(function(path){
      /*console.log("$analyticsProvider pageTrack:");
      console.log("Path: ", path);*/

      var url = window.location.pathname;
      mixpanel.track(url,
                     {'page name': url,
                      'url': url,
                      'path': path});
      ga('send',
         'pageview',
         {'page': path,
          'title': path});
    });
  }
]);
