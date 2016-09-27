angular.module('mosaink.common')

.factory('StripeService', function($http, $q, $log, helpers) {
  var is_prod = helpers.is_prod();
  var PUBLISHABLE_KEY = is_prod ? "pk_live_A33pIjToc4a2S9PGfMCRDOGI" : "pk_test_BKX3SgVqvcSbwjp0kMR3Pdwz";

  var init = function() {
    Stripe.setPublishableKey(PUBLISHABLE_KEY);
  };

  var remove_spaces = function(s) {
    return s.replace(/\s/g, '');
  };

  /**
   * Create a single use card token (used for charging from our backend) by
   * sending the payment form data to Stripe.
   * Supported additional data:
   *   name: cardholder name.
   *   address_line1: billing address line 1.
   *   address_line2: billing address line 2.
   *   address_city: billing address city.
   *   address_state: billing address state.
   *   address_zip: billing zip as a string, e.g. '94301'.
   *   address_country: billing address country.
   */
  var create_single_use_token = function(number, cvc, exp_month, exp_year, additionalData) {
    var deferred = $q.defer();
    number = remove_spaces(number);
    cvc = remove_spaces(cvc);
    exp_month = remove_spaces(exp_month);
    exp_year = remove_spaces(exp_year);

    /*
     * Successful response is on form:
     * {
     *   id: "tok_u5dg20Gra", // String of token identifier
     *   card: { // Dictionary of the card used to create the token
     *     name: null,
     *     address_line1: "12 Main Street",
     *     address_line2: "Apt 42",
     *     address_city: "Palo Alto",
     *     address_state: "CA",
     *     address_zip: "94301",
     *     address_country: "US",
     *     country: "US",
     *     exp_month: 2,
     *     exp_year: 2016,
     *     last4: "4242",
     *     object: "card",
     *     brand: "Visa",
     *     funding: "credit"
     *   },
     *   created: 1446025093, // Integer of date token was created
     *   livemode: true, // Boolean of whether this token was created with a live or test API key
     *   type: "card",
     *   object: "token", // String identifier of the type of object, always "token"
     *   used: false // Boolean of whether this token has been used
     * }
     *
     * Failed response is on form:
     * {
     *    error: {
     *     type: "card_error", // String identifier of the type of error
     *     code: "invalid_expiry_year", // Optional string identifier of specific error
     *     message: "Your card's expiration year is invalid.", // String description of the error
     *     param: "exp_year" // Optional string identifier of the offending parameter
     *   }
     * }
     */
    var stripeResponseHandler = function(status, response) {
      if (response.error) {
        $log.error("Failed creating Stripe single use token:");
        $log.error("Status:   " + status);
        $log.error("Response:");
        $log.error(response);
        deferred.reject(response.error);
      } else {
        deferred.resolve(response.id);
      }
    };

    var stripe_data = {
      number: number,
      cvc: cvc,
      exp_month: exp_month,
      exp_year: exp_year
    };
    if (typeof additionalData === "object") {
      angular.extend(stripe_data, additionalData);
    }
    Stripe.card.createToken(stripe_data, stripeResponseHandler);

    return deferred.promise;
  };

  init();

  return {
    create_single_use_token: create_single_use_token
  };
});
