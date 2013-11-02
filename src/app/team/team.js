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
.controller( 'TeamCtrl', function TeamController( $scope, TeamRes, $dialog, $stateParams, $translate, $translatePartialLoader ) {
  $scope.teams = TeamRes.query();
  $translatePartialLoader.addPart('team');
  $translate.refresh();

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

  $scope.setColumnDefs = function(){
    var columnDefs = [
      {field: 'id', displayName: $translate('Team_id_Column')},
      {field: 'name', displayName: $translate('Team_name_Column')},
      {field: 'captain', displayName: $translate('Team_captain_Column')},
      {field: 'club_id', displayName: $translate('Team_club_id_Column'), groupable: true, visible: false},
      {field: 'club_name', displayName: $translate('Team_club_name_Column'), groupable: true},
      {field: 'date_created', displayName: $translate('Team_date_created_Column'), cellFilter: "date:mediumDate"},
      {displayName: $translate('Team_Edit_Column'), cellTemplate: '<button id="editBtn" type="button" class="btn btn-primary" ng-click="editTeam(row.entity)" >{{"Team_Edit_Button" | translate}}</button> '},
      {displayName: $translate('Team_Delete_Column'), cellTemplate: '<button id="deleteBtn" type="button" class="btn btn-primary" ng-click="deleteTeam(row.entity)" >{{"Team_Delete_Button" | translate}}</button> '}
    ];
    $scope.columnDefs = columnDefs;
  };
  
  $scope.setColumnDefs();

  $scope.gridOptions = {
    data: 'teams',
    columnDefs: 'columnDefs',
    multiSelect: false,
    filterOptions: $scope.filterOptions,
    showColumnMenu: true,
    showGroupPanel: true,
    groups: ["club_name"]
  };

  $scope.$on('$translateChangeSuccess', function() {
    $scope.setColumnDefs();  
  });
  
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