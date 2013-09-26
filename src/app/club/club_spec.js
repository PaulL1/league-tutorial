/**
 * Unit tests for the club functionality
 */
describe( 'Club functionality', function() {
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
      dialog: function(parameters) {
        return this;
      },
      open: function(template, controller) {
        return this;
      },
      close: function(parameters) {
        return this;
      },
      then: function(callBack){
        callBack(this.response);
      }
    };
    
    // setup a mock for the club entity - it handles both $update and $remove methods, and calls the provided callback immediately (no promise needed)
    scope.fakeClub = {
      $update: function(callback) {
        callback(null);
      },
      $remove: function(callback) {
        callback();
      }
    };   
  }));

  afterEach(function() {
    scope.httpBackend.verifyNoOutstandingExpectation();
    scope.httpBackend.verifyNoOutstandingRequest();
  });
  
  describe( 'Base club controller', function() {  

    beforeEach(angular.mock.inject(function($controller){
      //declare the controller and inject our scope
      $controller('ClubCtrl', {$scope: scope, $dialog: scope.fakeDialog});
    }));
    
    describe( 'Initial render', function() {
      beforeEach(function() {
         // setup a mock for the resource - instead of calling the server always return a pre-canned response
        scope.httpBackend.expect('GET', '../clubs.json').respond([
          {"contact_officer":"Contact Officer 1","created_at":"2012-02-02T00:00:00Z","date_created":"2012-01-01T00:00:00Z","id":1,"name":"Club 1","updated_at":"2012-03-03T00:00:00Z"},
          {"contact_officer":"Contact Officer 2","created_at":"2012-02-02T00:00:00Z","date_created":"2012-01-01T00:00:00Z","id":2,"name":"Club 2","updated_at":"2012-03-03T00:00:00Z"}
        ]);
        scope.$digest();
        scope.httpBackend.flush();
      });
      
     // tests start here
      it('Has two clubs defined', function(){
        expect(scope.clubs.length).toEqual(2);
      });

      it('First club\'s contact officer is as expected', function(){
        expect(scope.clubs[0].contact_officer).toEqual('Contact Officer 1');
      });
    });
    
    describe('Other controller methods', function(){
      beforeEach(function() {
        // The initial render triggers a get before we get to the method that we're testing.
        // Drain that before we start the test proper
        scope.httpBackend.expectGET('../clubs.json').respond([]);
        scope.$digest();
        scope.httpBackend.flush();
      });
      
      it('Calls edit on first row, cancel', function() {
        scope.fakeDialog.response = 'cancel';

        // we expect the fakeDialog dialog and open methods to be called, so we spy on them to get the parameters
        spyOn(scope.fakeDialog, "dialog").andCallThrough();
        spyOn(scope.fakeDialog, "open").andCallThrough();

        // call edit
        scope.editClub(scope.clubs[0]);

        // check parameters passed in
        // haven't worked out how to verify the parameters of dialog, as they're passed as a promise (i.e. as a function), and I can't resolve them'
        expect(scope.fakeDialog.dialog).toHaveBeenCalled();
        expect(scope.fakeDialog.open).toHaveBeenCalledWith('club/club_edit.tpl.html', 'ClubEditCtrl');
      });

      it('Calls edit on first row, OK', function() {
        scope.fakeDialog.response = 'not-cancel';

        // we expect the fakeDialog dialog and open methods to be called, so we spy on them to get the parameters
        spyOn(scope.fakeDialog, "dialog").andCallThrough();
        spyOn(scope.fakeDialog, "open").andCallThrough();

        // call edit
        scope.editClub(scope.clubs[0]);

        // check parameters passed in
        // haven't worked out how to verify the parameters of dialog, as they're passed as a promise (i.e. as a function), and I can't resolve them'
        expect(scope.fakeDialog.dialog).toHaveBeenCalled();
        expect(scope.fakeDialog.open).toHaveBeenCalledWith('club/club_edit.tpl.html', 'ClubEditCtrl');

        // expect a get after the successful save 
        scope.httpBackend.expect('GET', '../clubs.json').respond([]);
        scope.$digest();        
        scope.httpBackend.flush();
      });
    });
  });

  describe( 'Edit controller', function() {
    //mock the controller
    beforeEach(angular.mock.inject(function($controller){

      //declare the controller and inject our parameters
      $controller('ClubEditCtrl', {$scope: scope, dialog: scope.fakeDialog, club: scope.fakeClub});
    }));

    // tests start here
    it('Submit calls put on server', function(){
      // we expect $update to be called on fakeClub, and close to be called on fakeDialog
      spyOn(scope.fakeClub, "$update").andCallThrough();
      spyOn(scope.fakeDialog, "close").andCallThrough();

      scope.submit();

      expect(scope.fakeClub.$update).toHaveBeenCalled();
      expect(scope.fakeDialog.close).toHaveBeenCalled();
    }); 

    it('Cancel does not call put on server', function(){
      // we expect $update not to be called on fakeClub, and close to be called on fakeDialog
      spyOn(scope.fakeClub, "$update").andCallThrough();
      spyOn(scope.fakeDialog, "close").andCallThrough();

      scope.cancel();

      expect(scope.fakeClub.$update).not.toHaveBeenCalled();
      expect(scope.fakeDialog.close).toHaveBeenCalledWith('cancel');
    }); 
  });
});    