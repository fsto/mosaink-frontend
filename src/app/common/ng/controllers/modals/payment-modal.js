angular.module('mosaink.common')

.controller('PaymentFormModalCtrl', function ($scope, $http, $log, LogService, CurrentUser, CurrentUserService, CurrentImage, CurrentImageService, ParseService, StripeService, modalHelpers) {
  // TODO: Is cancel action handled correctly?
  $scope.current_user = CurrentUser;
  $scope.image_model_id = CurrentImage.model_id;
  $scope.submit_payment_button_text = "Betala";
  $scope.processing_payment = false;
  $scope.card_type = undefined;
  $scope.card_number_is_valid = false;
  $scope.card_cvv_is_valid = false;
  $scope.card_number = {'number': ''};
  $scope.card_cvv = {'number': ''};
  $scope.form = {};
  $scope.submitted = false;

  $scope.EMAIL_REGEXP = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/;
  $scope.POSTAL_CODE_REGEXP = /^[0-9]{3} ?[0-9]{2}/;
  $scope.CARD_NUMBER_REGEXP = /^[0-9]{3} ?[0-9]{2}/;

  var init = function() {
    var image_urls = _.map(CurrentImageService.get_included_images(), function(o) {return o.standard_resolution_url;});
    var num_rows = CurrentImageService.get_height();
    var num_cols = CurrentImageService.get_width();
    var username = CurrentUserService.get_username_from_path();
    ParseService.create_image(image_urls, num_rows, num_cols, username)
    .then(
      // Successfully created Parse image model
      function(image_model_id) {
        CurrentImage.parse_id = image_model_id;
      }
    );
  };

  var reset_payment_button = function() {
    $scope.submit_payment_button_text = "Betala";
    $scope.processing_payment = false;
  };

  $scope.format_card_number = function() {
    var card_number = $scope.card_number.number;
    if (!card_number) { return; }

    var value = card_number.toString().trim().replace(/^\+/, '');
    value = value.replace(/\s/g, '');

    if (value.match(/[^0-9]/)) {
      return;
    }

    $scope.card_number.number = value.replace(/(.{4})/g,"$1 ").trim();
  };

  $scope.remove_all_spaces_from_card_number = function() {
    return $scope.card_number.number.replace(/\s/g, '').trim();
  };

  $scope.open_logout_modal = function() {
    modalHelpers.open_logout($scope);
  };

  $scope.update_card_type = function(card_number) {
    if (typeof(card_number) === 'undefined' || card_number.length === 0) {
      $scope.card_type = undefined;
    }
    else if (card_number.indexOf('3') === 0) {
      $scope.card_type = 'american_express';
    }
    else if (card_number.indexOf('4') === 0) {
      $scope.card_type = 'visa';
    }
    else if (card_number.indexOf('5') === 0) {
      $scope.card_type = 'mastercard';
    }
    else {
      $scope.card_type = 'unknown';
    }
  };

  $scope.set_card_number_validity = function() {
    $scope.card_number_is_valid = Stripe.card.validateCardNumber($scope.card_number.number);
    /*var card_number = $scope.card_number;
    var card_number_length = card_number.length;

    if ($scope.card_type === 'visa') {
      $scope.card_number_is_valid = card_number_length === 13 || card_number_length === 16;
    }
    else if ($scope.card_type === 'mastercard') {
      $scope.card_number_is_valid = card_number_length === 16;
    }
    else if ($scope.card_type === 'american_express') {
      $scope.card_number_is_valid = card_number_length === 15;
    }
    // Card number is not valid for unsupported card types
    else {
      $scope.card_number_is_valid = false;
    }*/
  };

  $scope.set_card_cvv_validity = function(card_cvv) {
    $scope.card_cvv_is_valid = card_cvv.length === 3;
  };

  $scope.submit_payment = function() {
    $scope.submitted = true;
    if (!$scope.submitted || $scope.form.payment.$invalid) {
      return;
    }

    StripeService.create_single_use_token(
      $scope.card_number.number,
      $scope.card_cvv_number,
      $scope.card_expire_month,
      $scope.card_expire_year,
      {
        name: $scope.card_holder_name,
        address_line1: $scope.shipping_address,
        address_city: $scope.shipping_city,
        address_zip: $scope.shipping_postal_code,
        address_country: "Sweden"
      }
    )
    .then(
      // Successfully created Stripe's single use token
      function(single_use_token) {
        $log.info("Got single use token from Stripe: " + single_use_token);
        return ParseService.order(
          single_use_token,
          CurrentImage.parse_id,
          $scope.email
        );
      },
      // Failed to create Stripe's single use token
      function(error) {
        $log.error("Failed creating single use token: " + error);
      }
    )
    .then(
      // Order & Stripe charge successful
      function() {
        $log.info("Successfully created order and charged via Stripe");
      },
      // Order & Stripe charge failed
      function() {
        $log.error("Failed creating order or charging via Stripe");
      }
    );

    // TODO: make Braintree a service
    /*var braintree = Braintree.create("MIIBCgKCAQEAuFALXu45H0UTEaEl2R7Wl7SrM+Nnrd8enr27zbde6EUyY1D5uI/DLfpZ+tPyMWBPKot4DiR6FRiO4z66Yr6HaYX1/V2bGVVXzwzP0tDxAVdoIU4xp5SWqGo2WMVseQW+pDy1ac1o6jxmJM6G51vaVyPvYTrG9QW0/fiPLwjK5jXbdHKeqZA0dDNmODD6/FHBVnEk0rx2ETZU6zId7cOZWV4otx9fohRKz+Y8o+CwNiBZ/wNdbjOnfiCae2i2H3E3dyfwlbD1sVrezfYLzAQq3L1yPG4qZX1eEMB6Nbs5mhb65wKyjdoLFbwAzG79emVgpeyQYedJ8J8tLlktFUneFwIDAQAB");
    braintree.encryptForm($('#braintree-payment-form'));
    var url = '/api/tiled-image/' + $scope.image_model_id + '/braintree-payment';

    $scope.submit_payment_button_text = "Genomför betalning...";
    $scope.processing_payment = true;

    LogService.eventTrackAuto(
        'Payment Submitted',
        {
          'Image Width': 'TODO',
          'Price': 'TODO',
          'Discount': 'TODO',
          'Email': $scope.email,
          'First Name': $scope.first_name,
          'Last Name': $scope.last_name,
          'Address': $scope.shipping_address,
          'Postal Code': $scope.shipping_postal_code,
          'City': $scope.shipping_city,
          'Card Type': $scope.card_type,
          'Card Number End': $scope.card_number_part.four || $scope.card_number_part.three,
          'Card Month': $scope.card_expire_month,
          'Card Year': $scope.card_expire_year
        }
    );

    $http({
      method: 'POST',
      url: url,
      data: $('#payment-form').serialize(),
      headers: {'Content-Type': 'application/x-www-form-urlencoded'}
    }).
      // Payment Successful
      success(function(data, status, headers, config) {
        reset_payment_button();
        $scope.payment_transaction_id = data.payment_transaction_id;

        LogService.eventTrackAuto(
            'Payment Successful',
            {'Payment Transaction ID': $scope.payment_transaction_id}
        );
      }).
      // Payment Error
      error(function(data, status, headers, config) {
        reset_payment_button();

        LogService.eventTrackAuto(
            'Payment Failed',
            {'Mosaink Server Error Message': data}
        );
      });*/
  }; // End $scope.submit_payment

  init();
});
