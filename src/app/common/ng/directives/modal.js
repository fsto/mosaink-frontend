angular.module('mosaink.common')

.directive('mosModal', function() {
  return {
    restrict: 'E',
    transclude: true,
    templateUrl: 'common/templates/modal-base.html',
    scope: true,
    link: function(scope, element, attrs) {
      scope.modalTitle = attrs.modaltitle;
    }
  };
});