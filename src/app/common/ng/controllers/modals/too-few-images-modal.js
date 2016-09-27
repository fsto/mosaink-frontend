var TooFewImagesInstanceCtrl = function ($scope, $modalInstance, $analytics, num_recommended_images, num_images, logout) {
  $scope.num_recommended_images = num_recommended_images;
  $scope.num_images = num_images;

  $scope.logout = function() {
    $scope.cancel();
    logout();
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');

    $analytics.eventTrack(
      'User Closes Modal'
    );
  };
};