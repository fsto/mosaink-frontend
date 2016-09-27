angular.module('mosaink.common')

.factory('InstagramService', function($http, $q, $timeout, helpers, LogService, CurrentImage) {
  var instagram_service_singleton = {};
  var is_prod = helpers.is_prod();
  var CLIENT_ID = is_prod ? '8234b91baf8146a780a5f845ae1e4275'
    : '8f4a5899089e40adb30b14b896feb536';
  var REDIRECT_URI = is_prod ? 'https://mosaink.com/'
    : 'http://localhost:9000/';
  var LOGOUT_URL = 'https://instagram.com/accounts/logout/';
  var CONNECT_URL = 'https://instagram.com/oauth/authorize/' +
    '?client_id=' + CLIENT_ID +
    '&redirect_uri=' + REDIRECT_URI +
    "&response_type=token";

  var get_user_data = function(token, id) {
    id = id || 'self';

    var url = 'https://api.instagram.com/v1/users/' + id + '/' +
      '?callback=JSON_CALLBACK' +
      '&access_token=' + token;
    var http_promise = $http.jsonp(url);
    http_promise.success(function () {
      LogService.info('Successfully fetched instagram user data');
    })
    .error(function(data) {
      LogService.info('Failed fetching instagram user data (' + url + '):');
      LogService.info(data);
      LogService.eventTrackAuto(
        'Failed Setting Current User',
        {'Instagram Server Response': data}
      );
    });

    return http_promise;
  };

  var get_instagram_images = function(instagram_client_id, instagram_user_id, images_url, success_callback, error_callback, partial_success_callback, all_images) {
    var instagram_model = "users";
    // For tags we just remove the leading #
    if (instagram_user_id.startsWith("#")) {
      instagram_user_id = instagram_user_id.substr(1);
      instagram_model = "tags";
    }

    // When getting first "page" of images
    if (!images_url) {
      LogService.eventTrackAuto('Loading Instagram Images');

      CurrentImage.images = [];
      images_url = 'https://api.instagram.com/v1/' + instagram_model + '/' +
        instagram_user_id +
        '/media/recent?callback=JSON_CALLBACK&client_id=' +
        instagram_client_id;
    }

    all_images = all_images || [];

    // Request images from instagram
    $http.jsonp(images_url).
      success(function(data, status) {
        var images = data.data;
        all_images.concat(images);

        // Load all paginated images
        if (data.pagination && data.pagination.next_url) {
          var next_url = data.pagination.next_url;
          // Replace callback param since $http.jsonp probably won't reuse the old one
          next_url = next_url.replace(/callback=angular.+?&/g, "callback=JSON_CALLBACK&");

          // Partial success callback
          if (partial_success_callback) {
            partial_success_callback.call(undefined, images);
          }

          get_instagram_images(
            instagram_client_id,
            instagram_user_id,
            next_url,
            success_callback,
            error_callback,
            partial_success_callback,
            all_images
          );
        }
        // All images loaded
        else {
          // Show error modal when too few images
          // if (images.length < MIN_SUGGESTED_IMAGES) {
          //   modalHelpers.open_too_few_images(MIN_SUGGESTED_IMAGES, images.length);
          // }

          // Enough images to create a Mosaink
          // Let's create an image model
          // else {
          LogService.eventTrackAuto(
            'Instagram Images Loaded',
            {'Number Received Images': all_images.length}
          );

          // }
          if (success_callback) {
            success_callback.call(undefined, all_images);
          }
        }
      }).
      error(function(data, status) {
        LogService.eventTrackAuto(
            'Failed Loading Instagram Images',
            {'Instagram Server Response': data,
             'Instagram Image Url': images_url}
        );

        if (error_callback) {
          error_callback.call();
        }
      });
  };

  var get_id_from_username = function(username) {
    var deferred = $q.defer();

    // If id is a tag (starts with #), just resolve itself
    if (username.startsWith("#")) {
      $timeout(function() {
        deferred.resolve(username);
      }, 0);
      return deferred.promise;
    }

    var search_url = "https://api.instagram.com/v1/users/search?callback=JSON_CALLBACK&q=" + username + "&client_id=" + CLIENT_ID;

    $http.jsonp(search_url)
    .success(function(data, status) {
      try {
        var id = _.filter(data.data, function(u){ return u.username === username; })[0].id;
        deferred.resolve(id);
      } catch (err) {
        deferred.reject("Failed to extract username from Instagram API response");
      }
    })
    .error(function(data, status) {
      deferred.reject("Failed making Instagram API request: " + data);
    });

    return deferred.promise;
  };

  var get_follows = function(instagram_token, follows_url) {
    follows_url = follows_url || "https://api.instagram.com/v1/users/self/follows?callback=JSON_CALLBACK&access_token=" + instagram_token;
    var follows = [];

    LogService.eventTrackAuto('Loading Instagram User Follows');

    // Request images from instagram
    $http.jsonp(follows_url).
    success(function(data, status) {
      // For each new image, add it to the right row
      var new_follows = data.data;
      var num_follows = new_follows.length;
      LogService.info('Got ' + num_follows + ' more follows');
      for (var i = 0; i < num_follows; i++) {
        var follow = new_follows[i];
        follows.push({
          full_name: follow.full_name,
          username: follow.username,
          id: follow.id
        });
      }

      // Recurseviley load all paginated follows
      if (data.pagination && data.pagination.next_url) {
        var next_url = data.pagination.next_url;
        // Replace callback param since $http.jsonp probably won't reuse the old one
        next_url = next_url.replace(/callback=angular.+&/g, "callback=JSON_CALLBACK&");
        get_follows(instagram_token, next_url);
      }

      else {
        LogService.eventTrackAuto(
            'Instagram User Follows Loaded',
            {'Number Found Follows': follows.length}
        );
      }
    }).
    error(function(data, status) {
      LogService.eventTrackAuto(
          'Failed Loading Instagram User Follows',
          {'Instagram Server Response': data}
      );

      // TODO: invalid way of opening a modal
      // modalHelpers.open_error("Gick ej att hämta användare du följer!\nTODO Mer info...");
    });

    return follows;
  };

  return {
    CONNECT_URL: CONNECT_URL,
    CLIENT_ID: CLIENT_ID,
    get_user_data: get_user_data,
    get_instagram_images: get_instagram_images,
    get_id_from_username: get_id_from_username,
    get_follows: get_follows
  };
});
