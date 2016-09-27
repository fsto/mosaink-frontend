/**
 * Helper functions
 */

angular.module('mosaink.common')

.factory('helpers', function($location, $uibModal, $analytics) {
  var is_prod = function() {
    return $location.host().indexOf("mosaink.com") !== -1;
  };

  var logout = function(logout_url) {
    $location.path(logout_url || '/connect');
  };

  var track_link = function(url, event_name, properties) {
    properties = properties || {};
    function callback() {
      window.location = url;
    }

    // If below's mixpanel function doesn't execute within 300 ms,
    // redirect anyway.
    setTimeout(callback, 300);
    // As soon as we tracked the redirect, actually redirect
    mixpanel.track(event_name, properties, callback);
  };

  var logout_with_modal = function(redirect_url) {
    var template_url = 'common/templates/logout-info-modal.html';
    redirect_url = redirect_url || '/';

    $analytics.pageTrack(template_url);
    $analytics.eventTrack(
        'User Opens Logout Modal',
        {'Template URL': template_url}
    );

    var modalInstance = $uibModal.open({
      templateUrl: template_url,
      controller: 'LogoutModalInstanceCtrl',
      resolve: {
        redirect_url: function () {
          return redirect_url;
        },
        track_link: function () {
          return track_link;
        }
      }
    });
  };

  return {
    is_prod: is_prod,
    logout: logout,
    track_link: track_link
  };
});
