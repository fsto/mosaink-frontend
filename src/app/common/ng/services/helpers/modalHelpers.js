/**
 * Helper functions
 */

angular.module('mosaink.common')

.factory('modalHelpers', function($modal, $uibModal, $log, LogService, CurrentImage, locationHelpers) {
  var open = function (template_url, image_model_id) {
    LogService.pageTrack(template_url);
    LogService.eventTrackAuto(
        'User Opens Modal',
        {'Template URL': template_url}
    );

    var modalInstance = $uibModal.open({
      templateUrl: template_url,
      controller: 'ModalInstanceCtrl',
      resolve: {
        /*current_user: function () {
          return CurrentUserService.current_user;
        },*/
        image_model_id: function() {
          return image_model_id;
        }
      }
    });
  };

  var open_too_few_images = function(num_recommended_images, num_images) {
    var template_url = 'common/templates/too-few-images-modal.html';

    LogService.pageTrack(template_url);
    LogService.eventTrackAuto(
        'Too few images modal',
        {'Recommended Num Images': num_recommended_images,
         'Num Images': num_images}
    );

    var modalInstance = $uibModal.open({
      templateUrl: template_url,
      controller: 'LogoutModalInstanceCtrl',
      resolve: {
        num_recommended_images: function () {
          return num_recommended_images;
        },
        num_images: function () {
          return num_images;
        },
        logout: function() {
          return locationHelpers.logout;
        }
      }
    });
  };

  var open_error = function(error_message) {
    // TODO: Support error messages to be shown in this modal
    var template_url = 'common/templates/error-modal.html';

    LogService.pageTrack(template_url);
    LogService.eventTrackAuto(
        'Error Modal',
        {'Error Message': error_message}
    );

    $uibModal({
      template: template_url,
      animation: "am-fade-and-scale",
      container: 'body'
    });
  };

  var open_payment_modal = function (scope) {
    var template_url = "common/templates/payment-form.html";
    LogService.pageTrack('/payment-form');

    LogService.eventTrack('User Opens Payment Modal');

    var paymentModal = $modal({
      scope: scope,
      template: template_url,
      container: 'body'
    });

    /*var payment_modal_instance = $uibModal.open({
      templateUrl: 'common/templates/payment-form.html',
      controller: 'paymentInstanceCtrl',
      resolve: {
        current_user: function () {
          return CurrentUserService;
        },
        image_model_id: function() {
          return CurrentImage.id;
        },
        logout: function () {
          return locationHelpers.logout;
        },
        open_logout: function () {
          return open_logout;
        }
      }
    });

    payment_modal_instance.result.then(function (payment_transaction_id) {
      open_payment_success(payment_transaction_id);
    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });
    */
  };

  var open_payment_success = function (payment_transaction_id) {
    var template_url = 'common/templates/payment-success.html';

    LogService.eventTrackAuto(
        'Payment Successful Modal',
        {'Payment Transaction ID': payment_transaction_id}
    );

    var payment_success_instance = $uibModal.open({
      templateUrl: template_url,
      controller: 'paymentInstanceCtrl',
      resolve: {
        /*current_user: function () {
          return CurrentUserService;
        },*/
        image_model_id: function() {
          return CurrentImage.id;
        },
        logout: function () {
          return locationHelpers.logout;
        },
        open_logout: function () {
          return open_logout;
        }
      }
    });

    payment_success_instance.result.then(function (selectedItem) {
    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });
  };

  var open_logout = function(redirect_url) {
    var template_url = 'common/templates/logout-info-modal.html';

    LogService.pageTrack(template_url);
    LogService.eventTrackAuto(
        'User Opens Logout Modal',
        {'Template URL': template_url}
    );

    $uibModal({
      template: template_url,
      animation: "am-fade-and-scale",
      container: 'body'
    });
  };

  return {
    open: open,
    open_error: open_error,
    open_too_few_images: open_too_few_images,
    open_payment_modal: open_payment_modal,
    open_payment_success: open_payment_success,
    open_logout: open_logout,
  };
});
