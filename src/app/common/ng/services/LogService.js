angular.module('mosaink.common')

.factory('LogService', function($log, $analytics, CurrentUser, CurrentImage) {
  /**
   * Copies `attributes` on `src` into `dst` object. All attributes in lists
   * will be copied as a first level attribute in `dst`.
   */
  var flat_copy_attributes = function(src, dst, attributes, prefix) {
    prefix = prefix || '';

    for (var i = 0; i < attributes.length; i++) {
      var attribute = attributes[i];
      // For nested attributes, extract the nested object and recurse on that
      if (attribute instanceof Object) {
        var nested_attributes_parent = attribute.nested_attribute_name;
        var nested_attributes = attribute.nested_attributes;
        var nested_src = src[nested_attributes_parent];
        flat_copy_attributes(nested_src, dst, nested_attributes, nested_attributes_parent);
      }
      if (src[attributes]) {
        dst[attribute] = src[attribute];
      }
    }
  };

  var get_user_data = function() {
    // TODO: Get image model data
    var user_data = {};
    var user_attributes = [
      'username',
      'id',
      'token',
      'bio',
      'followed_by',
      'profile_picture',
      'website',
      {
        'nested_attribute_parent': 'counts',
        'nested_attributes':
        [
          'followed_by',
          'follows',
          'media'
        ]
      }
    ];

    user_data = flat_copy_attributes(CurrentUser, user_data, user_attributes);
    return user_data;
  };

  var get_image_data = function() {
    // TODO: Get image model data
    var image_data = {};
    var image_attributes = [
      'id'
    ];
    
    flat_copy_attributes(CurrentUser, image_data, image_attributes);
    return image_data;
  };

  var info = function(message) {
    $log.info(message);
  };

  var debug = function(message) {
    $log.debug(message);
  };

  var error = function(message) {
    $log.error(message);
  };

  var eventTrack = function(eventName, data) {
    $analytics.eventTrack(eventName, data);
  };

  var pageTrack = function(page_url) {
    $analytics.pageTrack(page_url);
  };

  var eventTrackAuto = function(eventName, additionalData) {
    var data = {};
    // var data = get_user_data();
    // angular.extend(data, get_image_data());
    if (additionalData) {
      angular.extend(data, additionalData);
    }
    info(eventName);
    info(data);
    eventTrack(eventName, data);
  };

  return {
    info: info,
    debug: debug,
    error: error,
    eventTrack: eventTrack,
    eventTrackAuto: eventTrackAuto,
    pageTrack: pageTrack
  };
});