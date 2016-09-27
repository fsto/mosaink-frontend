angular.module('mosaink.common')

.directive('mosInstagramSearchInput', function($rootScope, $http, $location, $log, $timeout, $window, InstagramService) {
  var controller = function($scope, $element, $attrs, $transclude) {
    var searchInterval = 500;
    $scope.placeholder = "Search Instagram user";

    var init = function() {
      // Pre fill search query with preFilled
      if (typeof $scope.preFilled === "string" && $scope.preFilled.length > 0) {
        $scope.searchQuery = $scope.preFilled;
      }

      // Set placeholder
      /*$scope.setPlaceholder();*/
    };

    $scope.setPlaceholder = function() {
      if (typeof $scope.preFilled === "string" && $scope.preFilled.length > 0) {
        $scope.placeholder = $scope.preFilled;
      }
    };

    $scope.focused = function() {
      if ($scope.searchQuery === $scope.preFilled) {
        $scope.searchQuery = "";
      }
    };

    $scope.getRedirectUrl = function(username) {
      return $scope.redirectUrl.replace("{username}", username);
    };

    $scope.keyPressed = function(event) {
      if (!$scope.results) {
        return;
      }
      // Enter pressed
      if (event.keyCode === 13) {
        // Change location to selected profile
        if (typeof $scope.redirectUrl === 'undefined') {
          return;
        }
        var url = $scope.getRedirectUrl($scope.results[$scope.selectedUserIndex].username);

        $scope.gotoUrl(url);
      }
      // Up arrow pressed
      else if (event.keyCode === 38) {
        $scope.selectedUserIndex = ($scope.selectedUserIndex - 1) % $scope.results.length;
      }
      // Down arrow pressed
      else if (event.keyCode === 40) {
        $scope.selectedUserIndex = ($scope.selectedUserIndex + 1) % $scope.results.length;
      }
    };

    $scope.gotoUrl = function(url) {
      if (url.startsWith("#")) {
        url = url.substr(1);
      }
      $location.path(url);

      if (typeof $scope.reload === "string" && $scope.reload.toLowerCase() === "true") {
        $window.location.reload();
      }
    };

    $scope.selectUser = function(index) {
      $scope.selectedUserIndex = index;
    };

    $scope.search = function(viewValue) {
      var timeSinceLastSearch = new Date() - $scope.lastSearch;
      $scope.searchQuery = viewValue;

      if (timeSinceLastSearch < searchInterval) {
        $log.debug('Waiting with, last search was ' + timeSinceLastSearch + ' ms ago.');
        return;
      }
      else {
        // Search
        $scope.lastSearch = new Date();
        $timeout(function() {
          $log.debug('Searching since last search was ' + timeSinceLastSearch + ' ms ago.');
            /*var params = {address: $scope.searchQuery, sensor: false};
            $http.get('http://maps.googleapis.com/maps/api/geocode/json', {params: params})
            .then(function(res) {
                $scope.results = res.data.results;
              });*/
        var url = 'https://api.instagram.com/v1/users/search?q=' + $scope.searchQuery + '&client_id=' + InstagramService.CLIENT_ID + '&callback=JSON_CALLBACK';
        $http.jsonp(url)
        .then(function(res) {
          $scope.results = res.data.data;
          $scope.selectedUserIndex = 0;
        });
      }, searchInterval);
      }
    };

    init();
  };

  return {
    restrict: 'AE',
    controller: controller,
    scope: {
      redirectUrl:'@',
      reload: '@',
      preFilled: '='
    },
    templateUrl: 'common/templates/instagram-search-input.html'
  };
});
