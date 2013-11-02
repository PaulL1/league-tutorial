/**
 * Common error handling module
 */

angular.module( 'common.error_handling', [])

.directive('errorDisplay', function () {
  return {
    restrict: 'A',
    scope: {
      errors: '=',
      field: '@field'
    },
    templateUrl: 'error_handling/error_handling.tpl.html'
  };  
})
;
