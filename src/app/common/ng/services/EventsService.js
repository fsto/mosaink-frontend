angular.module('mosaink.common')

.factory('EventsService', function() {
  var EVENT_NAMES = {
    USER_SET: 'userSet',
    IMAGES_UPDATED: 'imagesUpdated'
  };

  return {
    EVENT_NAMES: EVENT_NAMES
  };
});