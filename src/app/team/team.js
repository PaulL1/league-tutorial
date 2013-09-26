/**
 * Team module
 */
angular.module( 'league.team', [
  'ui.state',
  'league.club',
  'ngResource',
   'ngGrid'
])

/**
 * Define the route that this module relates to, and the page template and controller that is tied to that route
 */
.config(function config( $stateProvider ) {
  $stateProvider.state( 'team', {
    url: '/team?club_id',
    views: {
      "main": {
        controller: 'TeamCtrl',
        templateUrl: 'team/team.tpl.html'
      }
    },
    data:{ pageTitle: 'Team' }
  });
})

/**
 * And of course we define a controller for our route.
 */
.controller( 'TeamCtrl', function TeamController( $scope, TeamRes, $dialog, $stateParams ) {
  $scope.teams = TeamRes.query();

  $scope.club_id = parseInt($stateParams.club_id, 10);

  if($scope.club_id) {
    $scope.filterOptions = {
      filterText: 'club_id:' + $scope.club_id
    };
  }
  else {
    $scope.filterOptions = {
      filterText: ''
    };
  }

  $scope.gridOptions = {
    data: 'teams',
    columnDefs: [
      {field: 'id', displayName: 'Id'},
      {field: 'name', displayName: 'Team Name'},
      {field: 'captain', displayName: 'Captain'},
      {field: 'club_id', displayName: 'Club Id', groupable: true, visible: false},
      {field: 'club_name', displayName: 'Club Name', groupable: true},
      {field: 'date_created', displayName: 'Date Created', cellFilter: "date:mediumDate"},
      {displayName: 'Edit', cellTemplate: '<button class="btn btn-primary" id="editBtn" type="button">Edit</button> '},
      {displayName: 'Delete', cellTemplate: '<button class="btn btn-primary" id="deleteBtn" type="button">Delete</button> '}
    ],
    multiSelect: false,
    filterOptions: $scope.filterOptions,
    showColumnMenu: true,
    showGroupPanel: true,
    groups: ["club_name"]
  };

  $scope.editTeam = function(team) {
    $scope.myDialog = $dialog.dialog({dialogFade: false, resolve: {team: function(){return angular.copy(team);}, isNew: function() {return false;}}});
    $scope.myDialog.open('team/team_edit.tpl.html', 'TeamEditCtrl').then(function(result){
      if (result === 'cancel'){}
      else {
        $scope.teams = TeamRes.query();
      }
    });  
  };
  
  $scope.newTeam = function() {
    $scope.myDialog = $dialog.dialog({dialogFade: false, resolve: {team: function(){
                                                                     var team = new TeamRes();
                                                                     if ($scope.club_id) {
                                                                       team.club_id = $scope.club_id;
                                                                     }
                                                                     return team; 
                                                                   }, 
                                                                   isNew: function() {return true;}}});
    $scope.myDialog.open('team/team_edit.tpl.html', 'TeamEditCtrl').then(function(result){
      if (result === 'cancel'){}
      else {
        $scope.teams = TeamRes.query();
      }
    });
  };    

  $scope.deleteTeam = function(team) {
    team.$remove (function() {
                      $scope.teams = TeamRes.query();
                    }, 
                  function(error) {
                    $scope.msgbox = $dialog.messageBox('Error', error, [{label: 'OK'}]);
                    $scope.msgbox.open();
                  });
  };
})

/**
 * We define a controller for the edit action
 */
.controller('TeamEditCtrl', function TeamEditController($scope, TeamRes, ClubRes, dialog, team, isNew) {
  $scope.team = team;
  $scope.clubs = ClubRes.query();

  $scope.submit = function() {
    if (isNew) {
      $scope.team.$save(function(data) {
                              dialog.close($scope.team);      
                            }, 
                          function(error) {
                              // don't close dialog, display an error
                              $scope.error = error;                              
                            });
    }
    else {
      $scope.team.$update(function(data) {
                              dialog.close($scope.team);      
                            }, 
                            function(error) {
                              // don't close dialog, display an error
                              $scope.error = error;  
                            });      
    }

  };

  $scope.cancel = function() {
    dialog.close('cancel');
  };
})


/**
 * Add a resource to allow us to get at the server
 */
.factory( 'TeamRes', function ( $resource )  {
  return $resource("../teams/:id.json", {id:'@id'}, {'update': {method:'PUT'}, 'remove': {method: 'DELETE', headers: {'Content-Type': 'application/json'}}});
})
;