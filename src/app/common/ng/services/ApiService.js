angular.module('mosaink.common')

.factory('ApiService', function($http, LogService) {
  var create_instagram_user = function(token) {
    var url = '/api/instagram-user';
    LogService.eventTrackAuto('Send Create User Model Request');
    return $http({
      method: 'POST',
      url: url,
      data: {"instagram_token": token}
    });
  };

  var create_image_model = function(images, instagram_token) {
    var url = '/api/tiled-image';
    var image_model_id;

    LogService.eventTrackAuto('Creating Image Model');
    return $http({
      method: 'POST',
      url: url,
      data: {"image_square": images,
             "instagram_token": instagram_token}
    })
    .success(function(data, status, headers, config) {
      LogService.eventTrackAuto(
        "Image Model Created",
        data
      );
    })
    .error(function(data, status, headers, config) {
      LogService.eventTrackAuto(
          'Failed Creating Image Model',
          {'Mosaink API Response': data,
           'Mosaink API Url': url}
      );
    });
  };

  var update_image_model = function(image_model_id, images_square, instagram_token) {
    var url = '/api/tiled-image/' + image_model_id;

    LogService.eventTrackAuto('Updating Image Model');
    return $http({
      method: 'PUT',
      url: url,
      data: {"image_square": images_square,
             "instagram_token": instagram_token}
    })
    .success(function(data, status, headers, config) {
      LogService.eventTrackAuto('Updated Image Model');
    })
    .error(function(data, status, headers, config) {
      LogService.eventTrackAuto(
          'Failed Updating Image Model',
          {'Mosaink API Response': data,
           'Mosaink API Url': url}
      );
    });
  };

  /*var render_image = function(image_model_id, images, instagram_token) {
    LogService.eventTrackAuto("Render image");
    var url = '/api/tiled-image/' + image_model_id + '/render';
    return $http({
      method: 'POST',
      url: url,
      data: {"image_square": images,
             "instagram_token": instagram_token}
    })
    .success(function(data, status, headers, config) {
      LogService.eventTrackAuto(
        "Successfully generated poster",
        {"Mosaink API Response": data}
      );
    })
    .error(function(data, status, headers, config) {
      LogService.eventTrackAuto(
        "Failed generating poster",
        {'Mosaink API Response': data,
         "Mosaink API Url": url}
      );
      modalHelpers.open_error("Gick ej att rendera bild!\nTODO Mer info...");
    });
  };*/

  return {
    create_instagram_user: create_instagram_user,
    create_image_model: create_image_model
  };
});