/**
 * Club module
 */
angular.module( 'league.club', [
  'ui.state'
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
.controller( 'ClubCtrl', function ClubController( $scope ) {
  $scope.clubs = [
    {name: "hard coded club 1", contact_officer: "hard coded officer 1"},
    {name: "hard coded club 2", contact_officer: "hard coded officer 2"}
  ];
})
;