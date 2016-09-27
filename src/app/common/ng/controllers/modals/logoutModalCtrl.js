angular.module('mosaink.common')

.controller('LogoutModalCtrl', function ($scope, locationHelpers) {
  // TODO: Log actions
  $scope.logout_and_redirect = function () {
    locationHelpers.logout('/');
  };
});