angular.module('mosaink.common')

.factory('CurrentImage', function() {
  var ratio_width = 1;
  var ratio_height = 1;
  var images = [];  // Containing all images
  var parse_id;

  var image_rows  = []; // Containing the image square of included images
  var not_included_image_rows = []; // Containing matrix of not included images

  return {
    images: images,
    ratio_width: ratio_width,
    ratio_height: ratio_height,

    image_rows: image_rows,
    not_included_image_rows: not_included_image_rows
  };
})

.factory('CurrentImageService', function($rootScope, CurrentImage, ApiService, EventsService, LogService, CurrentUserService) {

  var reset = function() {
    CurrentImage.images = [];
    $rootScope.$emit(EventsService.EVENT_NAMES.IMAGES_UPDATES);
  };

  /**
   * Get all inclued images in a 2D list (matrix) where each list is a row.
   */
  var get_included_images = function() {
    return CurrentImage.images.slice(0, num_included_images());
  };

  var get_included_image_matrix = function(width, height) {
    var matrix = [];
    width = width || get_width();
    height = height || get_height();
    for (var i = 0; i < height; i++) {
      var offset = i * width;
      var row = CurrentImage.images.slice(offset, offset + width);
      matrix.push(row);
    }
    return matrix;
  };

  /**
   * Get all excluded images in a list.
   */
  var get_excluded_images = function() {
    return CurrentImage.images.slice(num_included_images());
  };

  var num_included_images = function() {
    return get_width() * get_height();
  };

  var num_excluded_images = function() {
    return CurrentImage.images.length - num_included_images();
  };

  var get_ratio_factor = function() {
    // CurrentImage.ratio_width * CurrentImage.ratio_height * factor ^ 2 <= CurrentImage.length
    var factor = Math.floor(
      Math.sqrt(
        CurrentImage.images.length /
        (CurrentImage.ratio_width * CurrentImage.ratio_height)
      )
    );
    return factor;
  };

  var set_ratio = function(ratio_width, ratio_height) {
    // Only set ratio if both ratio_width and ratio_height are numbers
    if (typeof ratio_width === "number" && typeof ratio_height === "number") {
      CurrentImage.ratio_width = ratio_width;
      CurrentImage.ratio_height = ratio_height;
    }
  };

  /**
   * Calculate the width given the width / height ratio and number of images.
   */
  var get_width = function() {
    return get_ratio_factor() * CurrentImage.ratio_width;
  };

  /**
   * Calculate the height given the width / height ratio and number of images.
   */
  var get_height = function() {
    return get_ratio_factor() * CurrentImage.ratio_height;
  };

  /**
   * Swap images given indexes of both images.
   */
  var swap_images = function(index_a, index_b) {
    var tempImage = CurrentImage.images[index_a];
    CurrentImage.images[index_a] = CurrentImage.images[index_b];
    CurrentImage.images[index_b] = tempImage;
  };

  var swap_with_first_excluded_image = function(image_index) {
    var first_excluded_image_index = num_included_images();
    swap_images(image_index, first_excluded_image_index);
  };

  var replace_image_and_add_first_excluded_iamge = function(image_index) {
    var replaced_image = CurrentImage.images.splice(image_index, 1)[0];
    CurrentImage.images.push(replaced_image);
  };

  /**
   * Push a list of images to our images.
   */
  var push_images = function(new_images) {
    var num_new_images = new_images.length;
    LogService.eventTrackAuto('Pushing ' + num_new_images + ' more images');

    for (var i = 0; i < num_new_images; i++) {
      var image = new_images[i].images;
      var author_data = new_images[i].user;
      var caption_data = new_images[i].caption;
      var comment;
      if (caption_data) {
        comment = caption_data.text;
      }
      var thumbnail_url_ssl = image.thumbnail.url;
      if (thumbnail_url_ssl.indexOf('http://') === 0){
        thumbnail_url_ssl = thumbnail_url_ssl.replace('http://', 'https://');
      }

      CurrentImage.images.push({
        author_id: author_data.id,
        author_username: author_data.username,
        author_full_name: author_data.full_name,
        author_comment: comment,
        thumbnail_url: image.thumbnail.url,
        thumbnail_url_ssl: thumbnail_url_ssl,
        low_resolution_url: image.low_resolution.url,
        standard_resolution_url: image.standard_resolution.url
      });
    }
    $rootScope.$emit(EventsService.EVENT_NAMES.IMAGES_UPDATES);
  };

  return {
    reset: reset,
    get_included_images: get_included_images,
    get_included_image_matrix: get_included_image_matrix,
    get_excluded_images: get_excluded_images,
    num_included_images: num_included_images,
    num_excluded_images: num_excluded_images,
    set_ratio: set_ratio,
    get_width: get_width,
    get_height: get_height,
    swap_images: swap_images,
    swap_with_first_excluded_image: swap_with_first_excluded_image,
    replace_image_and_add_first_excluded_iamge: replace_image_and_add_first_excluded_iamge,
    push_images: push_images,
  };
});
