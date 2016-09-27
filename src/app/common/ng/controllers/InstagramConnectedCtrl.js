angular.module('mosaink.common')

.controller('InstagramConnectedCtrl', function ($scope, $routeParams, $location, CurrentUserService) {
    CurrentUserService.set_instagram_token_cookie($routeParams.instagram_token);
    $location.path('/my-mosaink');
});
