angular.module('mosaink.common')

.factory('CurrentUser', function() {
  // initiate the user
  var user_singleton = {id: "self"};

  user_singleton.extend = function (newData) {
    angular.extend(user_singleton, newData);
  };

  return user_singleton;
})

.factory('CurrentUserService', function($rootScope, $cookies, $location, ApiService, LogService, CurrentUser, InstagramService, CurrentImage, EventsService) {
  /**
   * CurrentUser logic and methods is abstracted to this singleton to avoid
   * circual dependencies.
   */

  var get_username_from_path = function() {
    var path_parts = $location.path().split("/");
    var username = path_parts[path_parts.length - 1];
    return username;
  };

  var get_instagram_token_cookie = function() {
    return $cookies.instagram_token;
  };

  var set_instagram_token_cookie = function(token) {
    $cookies.instagram_token = token;
  };

  var remove_instagram_token_cookie = function() {
    delete $cookies.instagram_token;
  };

  var set_from_instagram_token = function(token, id) {
    LogService.eventTrackAuto('Set Current User');

    var http_promise = InstagramService.get_user_data(token, id);
    http_promise.success(function(data, status) {
      CurrentUser.extend(data.data);
      // Use our API's profile picture proxy to support SSL for profile picture
      CurrentUser.extend(
        {'profile_picture': '/api/instagram-user/' + CurrentUser.id + '/profile-picture'}
      );

      $rootScope.$emit(EventsService.EVENT_NAMES.USER_SET);
      LogService.eventTrackAuto('Current User Set');
    });

    return http_promise;
  };

  var create_instagram_user = function(token) {
    return ApiService.create_instagram_user
    .success(function(data, status, headers, config) {
      LogService.eventTrackAuto('User Model Created');
      CurrentUser.extend({"model_id": data});
    });
  };

  return {
    get_username_from_path: get_username_from_path,
    get_instagram_token_cookie: get_instagram_token_cookie,
    set_instagram_token_cookie: set_instagram_token_cookie,
    remove_instagram_token_cookie: remove_instagram_token_cookie,
    set_from_instagram_token: set_from_instagram_token,
    create_instagram_user: create_instagram_user
  };
});
