var ErrorModalInstanceCtrl = function ($scope, $modalInstance, $route, $analytics, error_message) {
  $scope.error_message = error_message;

  $scope.reload_page = function() {
    function callback() {
      $modalInstance.close();
      $route.reload();
    }

    setTimeout(callback, 300);
    mixpanel.track('Clicked Reload Page Button', {}, callback);
  };
};