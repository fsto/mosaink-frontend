angular.module('mosaink.common')

.controller('PreviewCtrl', function ($rootScope, $scope, $location, $http, $routeParams, LogService, CurrentUser, CurrentUserService, CurrentImage, InstagramService, CurrentImageService, ApiService, EventsService, locationHelpers, modalHelpers) {
  $rootScope.$on(EventsService.EVENT_NAMES.USER_SET, function() {
    LogService.eventTrackAuto('User set event');
    $scope.current_user.username = CurrentUser.username;
  });

  var init = function() {
    // Reset current image
    $scope.username = CurrentUserService.get_username_from_path();
  };

  $scope.open_payment_modal = function() {
    modalHelpers.open_payment_modal();
  };

  init();
});
