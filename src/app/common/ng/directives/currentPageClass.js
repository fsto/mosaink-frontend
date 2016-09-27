angular.module('mosaink.common')

.directive('mosCurrentPageClass', function($rootScope, $location) {
  var e;
  var addedClassName = "";
  var classPrefix = "page-";

  var setCurrentPage = function() {
    var currentPageName = $location.path().substr(1).split("/")[0];

    if (!currentPageName) {
      return;
    }

    var newClassName = classPrefix + currentPageName;
    e.removeClass(addedClassName);
    e.addClass(newClassName);

    addedClassName = newClassName;
  };

  $rootScope.$on('$locationChangeSuccess', function(event) {
      setCurrentPage();
  });

  return {
    restrict: 'C',
    link: function(scope, element, attr) {
      e = element;
      setCurrentPage();
    }
  };
});
