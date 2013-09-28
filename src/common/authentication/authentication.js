/**
 * Authentication module, redirects to homepage if not logged in 
 */

angular.module('common.authentication', [])

.config(function($httpProvider){
  // Intercepts every http request.  If the response is success, pass it through.  If the response is an
  // error, and that error is 401 (unauthorised) then the user isn't logged in, redirect to the login page 
  var interceptor = function($q, $location, $rootScope) {
    return {
      'responseError': function(rejection) {
        if (rejection.status == 401) {
          $rootScope.$broadcast('event:unauthorized');
          $location.path('/login');
          return rejection;
        }
        return $q.reject(rejection);        
      }
    };
  };
  $httpProvider.interceptors.push(interceptor);
});