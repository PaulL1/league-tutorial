/**
 * Club module
 */
angular.module( 'league.club', [
  'ui.state',
  'ngResource'
])

/**
 * Define the route that this module relates to, and the page template and controller that is tied to that route
 */
.config(function config( $stateProvider ) {
  $stateProvider.state( 'club', {
    url: '/club',
    views: {
      "main": {
        controller: 'ClubCtrl',
        templateUrl: 'club/club.tpl.html'
      }
    },
    data:{ pageTitle: 'Club' }
  });
})

/**
 * And of course we define a controller for our route.
 */
.controller( 'ClubCtrl', function ClubController( $scope, ClubRes ) {
  $scope.clubs = ClubRes.query();
})

/**
 * Add a resource to allow us to get at the server
 */
.factory( 'ClubRes', function ( $resource )  {
  return $resource('../clubs.json');
})
;