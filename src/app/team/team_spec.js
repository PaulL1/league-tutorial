/**
 * Unit tests for the team functionality
 */
describe( 'Team functionality', function() {
  // mock Application to allow us to inject our own dependencies
  beforeEach(angular.mock.module('league'));

  // create the custom mocks on the root scope
  beforeEach(angular.mock.inject(function($rootScope, _$httpBackend_){
    //create an empty scope
    scope = $rootScope.$new();

    // we're just declaring the httpBackend here, we're not setting up expectations or when's - they change on each test
    scope.httpBackend = _$httpBackend_;

    // setup a mock for the dialog - when called it returns the value that was input when it was instantiated
    scope.fakeDialog = {
      response: null,
      isNew: null,
      team: null,
      dialog: function(parameters) {
        this.team = parameters.resolve.team();
        this.isNew = parameters.resolve.isNew();
        return this;
      },
      open: function(template, controller) {
        return this;
      },
      close: function(parameters) {
        return this;
      },
      messageBox: function(title, message, buttons) {
        return this;
      },
      then: function(callBack){
        callBack(this.response);
      }
    };
    
    // setup a mock for the team entity - it handles both $update and $remove methods, and calls the provided callback immediately (no promise needed)
    scope.fakeTeam = {
      precannedResponse: 'success',
      $save: function(callback_success, callback_fail) {
        if (this.precannedResponse == 'success') {
          callback_success(null);
        } else {
          callback_fail(null);
        }        
      },
      $update: function(callback_success, callback_fail) {
        if (this.precannedResponse == 'success') {
          callback_success(null);
        } else {
          callback_fail(null);
        }
      },
      $remove: function(callback_success, callback_fail) {
        if (this.precannedResponse == 'success') {
          callback_success(null);
        } else {
          callback_fail(null);
        }
      }
    }; 
  }));

  afterEach(function() {
    scope.httpBackend.verifyNoOutstandingExpectation();
    scope.httpBackend.verifyNoOutstandingRequest();
  });
  
  describe( 'Base team controller', function() {  

    beforeEach(angular.mock.inject(function($controller){
      //declare the controller and inject our scope
      $controller('TeamCtrl', {$scope: scope, $dialog: scope.fakeDialog});

       // setup a mock for the resource - instead of calling the server always return a pre-canned response
      scope.httpBackend.expect('GET', '../teams.json').respond([
        {"contact_officer":"Contact Officer 1","created_at":"2012-02-02T00:00:00Z","date_created":"2012-01-01T00:00:00Z","id":1,"name":"Team 1","updated_at":"2012-03-03T00:00:00Z"},
        {"contact_officer":"Contact Officer 2","created_at":"2012-02-02T00:00:00Z","date_created":"2012-01-01T00:00:00Z","id":2,"name":"Team 2","updated_at":"2012-03-03T00:00:00Z"}
      ]);
      scope.$digest();
      scope.httpBackend.flush();
    }));
   
    describe( 'Initial render', function() {      
      it('Has two teams defined', function(){
        expect(scope.teams.length).toEqual(2);
      });

      it('First team\'s contact officer is as expected', function(){
        expect(scope.teams[0].contact_officer).toEqual('Contact Officer 1');
      });
    });
    
    describe('Other controller methods', function(){
      it('Calls edit on first row, cancel', function() {
        scope.fakeDialog.response = 'cancel';

        // we expect the fakeDialog dialog and open methods to be called, so we spy on them to get the parameters
        spyOn(scope.fakeDialog, "dialog").andCallThrough();
        spyOn(scope.fakeDialog, "open").andCallThrough();

        // call edit
        scope.editTeam(scope.teams[0]);

        // check parameters passed in
        expect(scope.fakeDialog.dialog).toHaveBeenCalledWith({dialogFade: false, resolve: {team: jasmine.any(Function), isNew: jasmine.any(Function)}});
        expect(scope.fakeDialog.isNew).toEqual(false);
        expect(scope.fakeDialog.team.contact_officer).toEqual('Contact Officer 1');
        expect(scope.fakeDialog.open).toHaveBeenCalledWith('team/team_edit.tpl.html', 'TeamEditCtrl');
      });

      it('Calls edit on first row, OK', function() {
        scope.fakeDialog.response = 'not-cancel';

        // we expect the fakeDialog dialog and open methods to be called, so we spy on them to get the parameters
        spyOn(scope.fakeDialog, "dialog").andCallThrough();
        spyOn(scope.fakeDialog, "open").andCallThrough();

        // call edit
        scope.editTeam(scope.teams[0]);

        // check parameters passed in
        expect(scope.fakeDialog.dialog).toHaveBeenCalledWith({dialogFade: false, resolve: {team: jasmine.any(Function), isNew: jasmine.any(Function)}});
        expect(scope.fakeDialog.isNew).toEqual(false);
        expect(scope.fakeDialog.team.contact_officer).toEqual('Contact Officer 1');
        expect(scope.fakeDialog.open).toHaveBeenCalledWith('team/team_edit.tpl.html', 'TeamEditCtrl');

        // expect a get after the successful save 
        scope.httpBackend.expect('GET', '../teams.json').respond([]);
        scope.$digest();        
        scope.httpBackend.flush();
      });

      it('Calls new, result cancel', function() {
        scope.fakeDialog.response = 'cancel';

        // we expect the fakeDialog dialog and open methods to be called, so we spy on them to get the parameters
        spyOn(scope.fakeDialog, "dialog").andCallThrough();
        spyOn(scope.fakeDialog, "open").andCallThrough();
        
        // call new
        scope.newTeam();

        // check parameters passed in
        expect(scope.fakeDialog.dialog).toHaveBeenCalledWith({dialogFade: false, resolve: {team: jasmine.any(Function), isNew: jasmine.any(Function)}});
        expect(scope.fakeDialog.isNew).toEqual(true);
        expect(scope.fakeDialog.open).toHaveBeenCalledWith('team/team_edit.tpl.html', 'TeamEditCtrl');
      });
    
      it('Calls new, result OK', function() {
        scope.fakeDialog.response = 'not-cancel';

        // we expect the fakeDialog dialog and open methods to be called, so we spy on them to get the parameters
        spyOn(scope.fakeDialog, "dialog").andCallThrough();
        spyOn(scope.fakeDialog, "open").andCallThrough();
                
        // call new
        scope.newTeam();

        // check parameters passed in
        expect(scope.fakeDialog.dialog).toHaveBeenCalledWith({dialogFade: false, resolve: {team: jasmine.any(Function), isNew: jasmine.any(Function)}});
        expect(scope.fakeDialog.isNew).toEqual(true);
        expect(scope.fakeDialog.open).toHaveBeenCalledWith('team/team_edit.tpl.html', 'TeamEditCtrl');

        // expect a query refresh
        scope.httpBackend.expect('GET', '../teams.json').respond([]);
        scope.$digest();
        scope.httpBackend.flush();        
      });

      it('Calls delete, no error, and requeries', function() {
        // we expect the remove method to be called on fakeTeam, so we spy on fakeTeam
        spyOn(scope.fakeTeam, "$remove").andCallThrough();
        
        // we expect a messagebox not to be displayed, so we spy on fakeDialog
        spyOn(scope.fakeDialog, "messageBox").andCallThrough();
        
        // call the delete
        scope.deleteTeam(scope.fakeTeam);
        
        // expect stuff to have happened
        expect(scope.fakeTeam.$remove).toHaveBeenCalled();
        expect(scope.fakeDialog.messageBox).not.toHaveBeenCalled();
        
        // expect a refresh on the query
        scope.httpBackend.expect('GET', '../teams.json').respond([]);
        scope.$digest();
        scope.httpBackend.flush();        
      });

      it('Calls delete, gets error, and shows error box', function() {
        // we expect the remove method to be called on fakeTeam, so we spy on the fakeTeam methods
        spyOn(scope.fakeTeam, "$remove").andCallThrough();
        
        // we expect a messagebox not to be displayed, so we spy on fakeDialog
        spyOn(scope.fakeDialog, "messageBox").andCallThrough();

        // set the mock to return an error
        scope.fakeTeam.precannedResponse = 'not-success';
        
        // call the delete
        scope.deleteTeam(scope.fakeTeam);
        
        // expect an error mesageBox to have been shown
        expect(scope.fakeTeam.$remove).toHaveBeenCalled();
        expect(scope.fakeDialog.messageBox).toHaveBeenCalledWith('Error', null, [{label: 'OK'}]);
      });
    });
  });

  describe( 'Edit controller:', function() {
    //mock the controller
    beforeEach(angular.mock.inject(function($controller){
      // setup a mock for the isNew flag
      scope.isNew = false;
  
      //declare the controller and inject our parameters
      $controller('TeamEditCtrl', {$scope: scope, dialog: scope.fakeDialog, team: scope.fakeTeam, isNew: scope.isNew});
    }));
  
    // tests start here
    it('Submit calls put on server, put succeeds', function(){
      // we expect $update to be called on fakeTeam, and close to be called on fakeDialog
      spyOn(scope.fakeTeam, "$update").andCallThrough();
      spyOn(scope.fakeDialog, "close").andCallThrough();
      
      scope.submit();
      
      expect(scope.fakeTeam.$update).toHaveBeenCalled();
      expect(scope.fakeDialog.close).toHaveBeenCalled();
    }); 
    
    it('Submit calls put on server, put fails', function(){
      scope.fakeTeam.precannedResponse = 'fail';

      // we expect $update to be called on fakeTeam, and close not to be called on fakeDialog
      spyOn(scope.fakeTeam, "$update").andCallThrough();
      spyOn(scope.fakeDialog, "close").andCallThrough();

      scope.submit();
      
      expect(scope.fakeTeam.$update).toHaveBeenCalled();
      expect(scope.fakeDialog.close).not.toHaveBeenCalled();
    }); 
    
    it('Cancel does not call put on server', function(){
      // we expect $update not to be called on fakeTeam, and close to be called on fakeDialog
      spyOn(scope.fakeTeam, "$update").andCallThrough();
      spyOn(scope.fakeDialog, "close").andCallThrough();

      scope.cancel();
      
      expect(scope.fakeTeam.$update).not.toHaveBeenCalled();
      expect(scope.fakeDialog.close).toHaveBeenCalledWith('cancel');
    }); 
  });
});    