/**
 * Club module
 */
angular.module( 'league.club', [
  'ui.state',
  'ngResource',
   'ngGrid'
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
.controller( 'ClubCtrl', function ClubController( $scope, ClubRes, $dialog ) {
  $scope.clubs = ClubRes.query();
  $scope.gridOptions = {
    data: 'clubs',
    columnDefs: [
      {field: 'id', displayName: 'Id'},
      {field: 'name', displayName: 'Club Name'},
      {field: 'contact_officer', displayName: 'Contact Officer'},
      {displayName: 'Edit', cellTemplate: '<button id="editBtn" type="button" class="btn btn-primary" ng-click="editClub(row.entity)" >Edit</button> '}
    ],
    multiSelect: false
  };

  $scope.editClub = function(club) {
    $scope.myDialog = $dialog.dialog({dialogFade: false, resolve: {club: function(){return angular.copy(club);}}});
    $scope.myDialog.open('club/club_edit.tpl.html', 'ClubEditCtrl').then(function(result){
      if (result === 'cancel'){}
      else {
        $scope.clubs = ClubRes.query();
      }
    });  
  };  
})

/**
 * We define a controller for the edit action
 */
.controller('ClubEditCtrl', function ClubEditController($scope, ClubRes, dialog, club) {
  $scope.club = club;
  $scope.submit = function() {
    $scope.club.$update(function(data) {
                            dialog.close($scope.club);      
                          });
   };

  $scope.cancel = function() {
    dialog.close('cancel');
  };
})

/**
 * Add a resource to allow us to get at the server
 */
.factory( 'ClubRes', function ( $resource )  {
  return $resource("../clubs/:id.json", {id:'@id'}, {'update': {method:'PUT'}});
})
;