angular.module('mosaink.common')

.factory('ParseService', function($http, $q, $log, helpers) {
  var is_prod = helpers.is_prod();
  var PARSE_APPLICATION_ID = is_prod ? "yFUNjDAPKbKmIpisGftbO0f1xWaGBQ4HaNFMInQ3" : "YLvuz0BNhFsm1atUeJqHUybeZQBLueytMM0oxwzu";
  var PARSE_JAVASCRIPT_KEY = is_prod ? "Xzx13BuJYy7vSFRh3dPKziUi801xuL7qM3OQMFmG" : "qavVH4moh6U3Qssy3hlk86ax59WJyOJxBThgGdZD";
  var MosainkImage = Parse.Object.extend("MosainkImage");

  var init = function() {
    Parse.initialize(PARSE_APPLICATION_ID, PARSE_JAVASCRIPT_KEY);
  };

  var registerUser = function(username) {
    var user = new Parse.User();
    user.set("username", "my name");
  };

  var create_image = function(image_urls, num_rows, num_cols, username) {
    var mosaink_image = new MosainkImage();
    mosaink_image.set("imageUrls", image_urls);
    mosaink_image.set("numRows", num_rows);
    mosaink_image.set("numCols", num_cols);
    mosaink_image.set("username", username);

    var deferred = $q.defer();
    mosaink_image.save(null, {
      success: function(mosaink_image) {
        // Execute any logic that should take place after the object is saved.
        $log.debug('New object created with objectId: ' + mosaink_image.id);
        deferred.resolve(mosaink_image.id);
      },
      error: function(mosaink_image, error) {
        // Execute any logic that should take place if the save fails.
        // error is a Parse.Error with an error code and message.
        $log.debug('Failed to create new object, with error code: ' + error.message);
        deferred.reject(error.message);
      }

    });

    return deferred.promise;
  };

  var order = function(single_use_token, mosaink_image_id, email) {
    Parse.Cloud.run(
      'order',
      {
        single_use_token: single_use_token,
        mosaink_image_id: mosaink_image_id,
        email: email
      },
      {
        success: function(ratings) {
        // ratings should be 4.5
        },
        error: function(error) {
        }
      }
    );
  };

  init();

  return {
    create_image: create_image,
    order: order
  };
});
