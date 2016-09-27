angular.module('mosaink.common')

.directive('mosFrame', function($rootScope, $http, $location, $log, $timeout, CurrentUser, CurrentUserService, CurrentImageService, EventsService, InstagramService, LogService, modalHelpers) {
  var controller = function($scope, $element, $attrs, $transclude) {
      var MIN_SUGGESTED_IMAGES = 64,
          images = [],
          default_ratio_width = 1,
          default_ratio_height = 1;
      $scope.included_image_matrix = [[]];
      $scope.state = {loading: false, checkout_disabled: true};
      $scope.selected_poster_image_i = undefined;
      $scope.selected_not_included_image_i = undefined;
      $scope.CurrentImageService = CurrentImageService;

      $rootScope.$on(EventsService.EVENT_NAMES.IMAGES_UPDATES, function() {
        LogService.eventTrackAuto('Images updated event');
        $scope.included_image_matrix = CurrentImageService.get_included_image_matrix();
      });

      var init = function() {
        // Start loading images if controller is loaded with a token set
        try {
          var ratio_width = parseInt($scope.ratioWidth);
          var ratio_height = parseInt($scope.ratioHeight);
          CurrentImageService.set_ratio(ratio_width, ratio_height);
        } catch (err) {
          CurrentImageService.set_ratio(default_ratio_width, default_ratio_height);

        }

        // Get and set username from location path
        var username = CurrentUserService.get_username_from_path();
        CurrentUser.extend({instagram_username: username});

        InstagramService.get_id_from_username(username)
        .then(
          // Successfully resolved instagram user id
          function(instagram_user_id) {
            CurrentUser.extend({instagram_user_id: instagram_user_id});

            LogService.eventTrackAuto('Load instagram images');
            $scope.state.loading = true;

            InstagramService.get_instagram_images(
              InstagramService.CLIENT_ID,
              instagram_user_id,
              // image url
              null,
              // Success callback
              function(all_images) {
                $scope.state.loading = false;
                $scope.state.checkout_disabled = false;
              },
              // Error callback
              function() {
                $scope.state.loading = false;
                modalHelpers.open_error("Gick ej att spara bildinformation!\nTODO Mer info...");
              },
              // Partial success callback
              function(new_images) {
                CurrentImageService.push_images(new_images);
              }
            );
          },
          // Failed to resolve instagram user id
          function() {
            $location.path("/");
          }
        );

      };  // End init()

      $scope.replace_image_and_add_first_excluded_iamge = function(image_index) {
        $log.info("Clicked on index " + image_index);
        CurrentImageService.replace_image_and_add_first_excluded_iamge(image_index);
        $scope.included_image_matrix = CurrentImageService.get_included_image_matrix();
      };

      $scope.select_poster_image = function(row_i, col_i) {
        var selected_poster_image_i = CurrentImageService.get_square_size(images.length) * row_i + col_i;
        var previously_selected_poster_image_i = $scope.selected_poster_image_i;
        // Deselect image if same image clicked again
        if (selected_poster_image_i === previously_selected_poster_image_i) {
          deselect_post_image();
          return;
        }
        else {
          // If we had another selected poster image, switch there places
          if (typeof previously_selected_poster_image_i !== 'undefined') {
            switch_images(previously_selected_poster_image_i, selected_poster_image_i)
            .error(function() {
              modalHelpers.open_error("Gick ej att uppdatera bildinformation!\nTODO Mer info...");
            });
          }
          // If a not included image is selected swap these
          else if (typeof $scope.selected_not_included_image_i !== 'undefined') {
            switch_images($scope.selected_not_included_image_i, selected_poster_image_i)
            .error(function() {
              modalHelpers.open_error("Gick ej att uppdatera bildinformation!\nTODO Mer info...");
            });
          }
          // Else just select the newly clicked poster image
          else {
            $scope.selected_poster_image_i = selected_poster_image_i;
            LogService.eventTrackAuto("Selected poster image on index: " + $scope.selected_poster_image_i);
          }
        }
      };

      var switch_images = function(previously_selected_poster_image_i, selected_poster_image_i) {
        deselect_post_image();
        deselect_not_selected_image();
        CurrentImageService.swap_images($scope.selected_not_included_image_i, selected_poster_image_i);
      };

      var deselect_post_image = function() {
        LogService.eventTrackAuto("Deselcted poster image on index: " + $scope.selected_poster_image_i);
        $scope.selected_poster_image_i = undefined;
      };

      var deselect_not_selected_image = function() {
        LogService.eventTrackAuto("Deselcted not included image on index: " + $scope.selected_not_included_image_i);
        $scope.selected_not_included_image_i = undefined;
      };

      init();
  };

  return {
    restrict: 'AE',
    controller: controller,
    scope: {
      // source: '@',
      username: '@',
      minImages:'@',
      ratioWidth: '@',
      ratioHeight: '@',
      maxRatioFactor: "=",
      state: '='
    },
    templateUrl: 'common/templates/mosaink-frame.html'
  };
});
