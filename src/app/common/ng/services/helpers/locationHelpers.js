/**
 * Helper functions
 */

angular.module('mosaink.common')

.factory('locationHelpers', function($location, $analytics, CurrentUserService) {
  var logout = function(logout_url) {
    logout_url = logout_url || '/';
    CurrentUserService.remove_instagram_token_cookie();
    track_link(logout_url, 'Logging out and redirecting to ' + logout_url);
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

  return {
    logout: logout,
    track_link: track_link
  };
});
