/**
 * Unit tests for the club functionality
 */
describe( 'Login functionality.', function() {
  // mock Application to allow us to inject our own dependencies
  beforeEach(angular.mock.module('league'));

  // create the custom mocks on the root scope
  beforeEach(angular.mock.inject(function($rootScope, _$httpBackend_){
    //create an empty scope
    scope = $rootScope.$new();
    
    // we're just declaring the httpBackend here, we're not setting up expectations or when's - they change on each test
    scope.httpBackend = _$httpBackend_; 
  }));
  
  afterEach(function() {
    scope.$digest();
    scope.httpBackend.verifyNoOutstandingExpectation();
    scope.httpBackend.verifyNoOutstandingRequest();
  });  
  
  
  describe( 'Base login controller.', function() {  
    
    beforeEach(angular.mock.inject(function($controller){
      //declare the controller and inject our scope
      $controller('LoginCtrl', {$scope: scope});
    }));
 
    describe( 'Initial render:', function() {   
      it('Renders, no errors', function(){
        // nothing to see here, no methods called, no server trips
      });
    });
  
    describe('Submit: ', function(){
      // We test all combinations of error codes on the submit method, as that lets us then do only a couple of cases on each of the business facing
      // methods.
      it('success 201', function() {
        scope.httpBackend.expect('POST', '../users/sign_in.json', '{"user":{"email":"test@example.com","password":"apassword"}}').respond(201, '');
        
        // call edit
        scope.submit({method: 'POST', url: '../users/sign_in.json', data: '{"user":{"email":"test@example.com","password":"apassword"}}', success_message: 'You have been logged in.', error_entity: scope.login_error});
        
        scope.$digest();
        scope.httpBackend.flush();
        
        expect(scope.login_error.message).toEqual('You have been logged in.');
        expect(scope.login_error.errors).toEqual({});
      });

      it('success 204', function() {
        scope.httpBackend.expect('POST', '../users/sign_in.json', '{"user":{"email":"test@example.com","password":"apassword"}}').respond(204, '');
        
        // call edit
        scope.submit({method: 'POST', url: '../users/sign_in.json', data: '{"user":{"email":"test@example.com","password":"apassword"}}', success_message: 'You have been logged in.', error_entity: scope.login_error});
        
        scope.$digest();
        scope.httpBackend.flush();
        
        expect(scope.login_error.message).toEqual('You have been logged in.');
        expect(scope.login_error.errors).toEqual({});
      });

      it('success 203, which we don\'t recognise', function() {
        scope.httpBackend.expect('POST', '../users/sign_in.json', '{"user":{"email":"test@example.com","password":"apassword"}}').respond(203, 'some random response');
        
        // call edit
        scope.submit({method: 'POST', url: '../users/sign_in.json', data: '{"user":{"email":"test@example.com","password":"apassword"}}', success_message: 'You have been logged in.', error_entity: scope.login_error});
        
        scope.$digest();
        scope.httpBackend.flush();
                
        expect(scope.login_error.message).toEqual('Success, but with an unexpected success code, potentially a server error, please report via support channels as this indicates a code defect.  Server response was: "some random response"');
        expect(scope.login_error.errors).toEqual({});
      });

      it('fail 422, with errors on password and email fields', function() {
        scope.httpBackend.expect('POST', '../users/sign_in.json', '{"user":{"email":"test@example.com","password":"apassword"}}').respond(422, '{"errors": {"password": ["Is mandatory"], "email": ["Is dodgy"]}}');
        
        // call edit
        scope.submit({method: 'POST', url: '../users/sign_in.json', data: '{"user":{"email":"test@example.com","password":"apassword"}}', success_message: 'You have been logged in.', error_entity: scope.login_error});
        
        scope.$digest();
        scope.httpBackend.flush();
                
        expect(scope.login_error.message).toBeNull();
        expect(scope.login_error.errors).toEqual({password: ["Is mandatory"], email: ["Is dodgy"]});
      });

      it('fail 423 (unrecognised failure), with an error message', function() {
        scope.httpBackend.expect('POST', '../users/sign_in.json', '{"user":{"email":"test@example.com","password":"apassword"}}').respond(423, '{"error": "Some random error"}');
        
        // call edit
        scope.submit({method: 'POST', url: '../users/sign_in.json', data: '{"user":{"email":"test@example.com","password":"apassword"}}', success_message: 'You have been logged in.', error_entity: scope.login_error});
        
        scope.$digest();
        scope.httpBackend.flush();
                
        expect(scope.login_error.message).toEqual("Some random error");
        expect(scope.login_error.errors).toEqual({});
      });

      it('fail 423 (unrecognised failure), without an error message', function() {
        scope.httpBackend.expect('POST', '../users/sign_in.json', '{"user":{"email":"test@example.com","password":"apassword"}}').respond(423, '{"otherjson": "Some other json stuff"}');
        
        // call edit
        scope.submit({method: 'POST', url: '../users/sign_in.json', data: '{"user":{"email":"test@example.com","password":"apassword"}}', success_message: 'You have been logged in.', error_entity: scope.login_error});
        
        scope.$digest();
        scope.httpBackend.flush();
                
        expect(scope.login_error.message).toEqual('Unexplained error, potentially a server error, please report via support channels as this indicates a code defect.  Server response was: {"otherjson":"Some other json stuff"}');
        expect(scope.login_error.errors).toEqual({});
      });

      it('clears out error messages on success', function() {
        scope.login_error.message = "Fred";
        scope.login_error.errors = {email: ["Has an error"]};
        scope.register_error.message = "Fred";
        scope.register_error.errors = {email: ["Has an error"]};
        
        scope.httpBackend.expect('POST', '../users/sign_in.json', '{"user":{"email":"test@example.com","password":"apassword"}}').respond(201, '');
        
        // call edit
        scope.submit({method: 'POST', url: '../users/sign_in.json', data: '{"user":{"email":"test@example.com","password":"apassword"}}', success_message: 'You have been logged in.', error_entity: scope.login_error});
        
        scope.$digest();
        scope.httpBackend.flush();
        
        expect(scope.login_error.message).toEqual('You have been logged in.');
        expect(scope.login_error.errors).toEqual({});
        expect(scope.register_error.message).toBeNull();
        expect(scope.register_error.errors).toEqual({});
      });

      it('clears out error messages on failure', function() {
        scope.login_error.message = "Fred";
        scope.login_error.errors = {email: ["Has an error"]};
        scope.register_error.message = "Fred";
        scope.register_error.errors = {email: ["Has an error"]};
        
        scope.httpBackend.expect('POST', '../users/sign_in.json', '{"user":{"email":"test@example.com","password":"apassword"}}').respond(423, '{"error": "An error"}');
        
        // call edit
        scope.submit({method: 'POST', url: '../users/sign_in.json', data: '{"user":{"email":"test@example.com","password":"apassword"}}', success_message: 'You have been logged in.', error_entity: scope.register_error});
        
        scope.$digest();
        scope.httpBackend.flush();
        
        expect(scope.login_error.message).toBeNull();
        expect(scope.login_error.errors).toEqual({});
        expect(scope.register_error.message).toEqual('An error');
        expect(scope.register_error.errors).toEqual({});
      });

      it('clears out input fields on success', function() {
        scope.login_user.email = "user@example.com";
        scope.login_user.password = "apassword";
        scope.register_user.email = "user@example.com";
        scope.register_user.password = "apassword";
        scope.register_user.password_confirmation = "apassword";
        
        scope.httpBackend.expect('POST', '../users/sign_in.json', '{"user":{"email":"test@example.com","password":"apassword"}}').respond(201, '');
        
        // call edit
        scope.submit({method: 'POST', url: '../users/sign_in.json', data: '{"user":{"email":"test@example.com","password":"apassword"}}', success_message: 'You have been logged in.', error_entity: scope.login_error});
        
        scope.$digest();
        scope.httpBackend.flush();
        
        expect(scope.login_user.email).toBeNull();
        expect(scope.login_user.password).toBeNull();
        expect(scope.register_user.email).toBeNull();
        expect(scope.register_user.password).toBeNull();
        expect(scope.register_user.password_confirmation).toBeNull();
      });

      it('does not clear out input fields on failure', function() {
        scope.login_user.email = "user@example.com";
        scope.login_user.password = "apassword";
        scope.register_user.email = "user@example.com";
        scope.register_user.password = "apassword";
        scope.register_user.password_confirmation = "apassword";
        
        scope.httpBackend.expect('POST', '../users/sign_in.json', '{"user":{"email":"test@example.com","password":"apassword"}}').respond(423, '{"error": "An error"}');
        
        // call edit
        scope.submit({method: 'POST', url: '../users/sign_in.json', data: '{"user":{"email":"test@example.com","password":"apassword"}}', success_message: 'You have been logged in.', error_entity: scope.register_error});
        
        scope.$digest();
        scope.httpBackend.flush();
        
        expect(scope.login_user.email).toEqual("user@example.com");
        expect(scope.login_user.password).toEqual("apassword");
        expect(scope.register_user.email).toEqual("user@example.com");
        expect(scope.register_user.password).toEqual("apassword");
        expect(scope.register_user.password_confirmation).toEqual("apassword");
      });
    });
    
    describe('Login: ', function(){
      // we only test 204 and 422, as those are our expected errors.  The others were covered in the submit testing
      it('success 204', function() {
        scope.login_user = {email: 'test@example.com', password: 'apassword'}; 
        scope.httpBackend.expect('POST', '../users/sign_in.json', '{"user":{"email":"test@example.com","password":"apassword"}}').respond(204, '');
        
        // call edit
        scope.login();
        
        scope.$digest();
        scope.httpBackend.flush();
        
        expect(scope.login_error.message).toEqual('You have been logged in.');
        expect(scope.login_error.errors).toEqual({});
      });

      it('fail 422', function() {
        scope.login_user = {email: 'test@example.com', password: 'apassword'}; 
        scope.httpBackend.expect('POST', '../users/sign_in.json', '{"user":{"email":"test@example.com","password":"apassword"}}').respond(422, '{"errors": {"password": ["Is mandatory"], "email": ["Is dodgy"]}}');
        
        // call edit
        scope.login();
        
        scope.$digest();
        scope.httpBackend.flush();
        
        expect(scope.login_error.message).toBeNull();
        expect(scope.login_error.errors).toEqual({password: ['Is mandatory'], email: ['Is dodgy']});
      });
    });

    describe('Logout: ', function(){
      // we only test 204 and 422, as those are our expected errors.  The others were covered in the submit testing
      it('success 204', function() {
        scope.login_user = {email: 'test@example.com', password: 'apassword'}; 
        scope.httpBackend.expect('DELETE', '../users/sign_out.json', null).respond(204, '');
        
        // call edit
        scope.logout();
        
        scope.$digest();
        scope.httpBackend.flush();
        
        expect(scope.login_error.message).toEqual('You have been logged out.');
        expect(scope.login_error.errors).toEqual({});
      });

      it('fail 401', function() {
        scope.login_user = {email: 'test@example.com', password: 'apassword'}; 
        scope.httpBackend.expect('DELETE', '../users/sign_out.json', null).respond(402, '');
        
        // call edit
        scope.logout();
        
        scope.$digest();
        scope.httpBackend.flush();
        
        expect(scope.login_error.message).toEqual('Unexplained error, potentially a server error, please report via support channels as this indicates a code defect.  Server response was: ""');
        expect(scope.login_error.errors).toEqual({});
      });
    });

    describe('Password reset: ', function(){
      // we only test 204 and 422, as those are our expected errors.  The others were covered in the submit testing
      it('success 204', function() {
        scope.login_user = {email: 'test@example.com', password: 'apassword'}; 
        scope.httpBackend.expect('POST', '../users/password.json', '{"user":{"email":"test@example.com"}}').respond(204, '');
        
        // call edit
        scope.password_reset();
        
        scope.$digest();
        scope.httpBackend.flush();
        
        expect(scope.login_error.message).toEqual('Reset instructions have been sent to your e-mail address.');
        expect(scope.login_error.errors).toEqual({});
      });

      it('fail 401', function() {
        scope.login_user = {email: 'test@example.com', password: 'apassword'}; 
        scope.httpBackend.expect('POST', '../users/password.json', '{"user":{"email":"test@example.com"}}').respond(402, '');
        
        // call edit
        scope.password_reset();
        
        scope.$digest();
        scope.httpBackend.flush();
        
        expect(scope.login_error.message).toEqual('Unexplained error, potentially a server error, please report via support channels as this indicates a code defect.  Server response was: ""');
        expect(scope.login_error.errors).toEqual({});
      });
    });

    describe('Unlock: ', function(){
      // we only test 204 and 422, as those are our expected errors.  The others were covered in the submit testing
      it('success 204', function() {
        scope.login_user = {email: 'test@example.com', password: 'apassword'}; 
        scope.httpBackend.expect('POST', '../users/unlock.json', '{"user":{"email":"test@example.com"}}').respond(204, '');
        
        // call edit
        scope.unlock();
        
        scope.$digest();
        scope.httpBackend.flush();
        
        expect(scope.login_error.message).toEqual('An unlock e-mail has been sent to your e-mail address.');
        expect(scope.login_error.errors).toEqual({});
      });

      it('fail 401', function() {
        scope.login_user = {email: 'test@example.com', password: 'apassword'}; 
        scope.httpBackend.expect('POST', '../users/unlock.json', '{"user":{"email":"test@example.com"}}').respond(402, '');
        
        // call edit
        scope.unlock();
        
        scope.$digest();
        scope.httpBackend.flush();
        
        expect(scope.login_error.message).toEqual('Unexplained error, potentially a server error, please report via support channels as this indicates a code defect.  Server response was: ""');
        expect(scope.login_error.errors).toEqual({});
      });
    });

    describe('Confirm: ', function(){
      // we only test 204 and 422, as those are our expected errors.  The others were covered in the submit testing
      it('success 204', function() {
        scope.login_user = {email: 'test@example.com', password: 'apassword'}; 
        scope.httpBackend.expect('POST', '../users/confirmation.json', '{"user":{"email":"test@example.com"}}').respond(204, '');
        
        // call edit
        scope.confirm();
        
        scope.$digest();
        scope.httpBackend.flush();
        
        expect(scope.login_error.message).toEqual('A new confirmation link has been sent to your e-mail address.');
        expect(scope.login_error.errors).toEqual({});
      });

      it('fail 401', function() {
        scope.login_user = {email: 'test@example.com', password: 'apassword'}; 
        scope.httpBackend.expect('POST', '../users/confirmation.json', '{"user":{"email":"test@example.com"}}').respond(402, '');
        
        // call edit
        scope.confirm();
        
        scope.$digest();
        scope.httpBackend.flush();
        
        expect(scope.login_error.message).toEqual('Unexplained error, potentially a server error, please report via support channels as this indicates a code defect.  Server response was: ""');
        expect(scope.login_error.errors).toEqual({});
      });
    });

    describe('Registration: ', function(){
      // we only test 204 and 422, as those are our expected errors.  The others were covered in the submit testing
      it('success 204', function() {
        scope.register_user = {email: 'test@example.com', password: 'apassword', password_confirmation: 'bpassword'}; 
        scope.httpBackend.expect('POST', '../users.json', '{"user":{"email":"test@example.com","password":"apassword","password_confirmation":"bpassword"}}').respond(204, '');
        
        // call edit
        scope.register();
        
        scope.$digest();
        scope.httpBackend.flush();
        
        expect(scope.register_error.message).toEqual('You have been registered and logged in.  A confirmation e-mail has been sent to your e-mail address, your access will terminate in 2 days if you do not use the link in that e-mail.');
        expect(scope.register_error.errors).toEqual({});
      });

      it('fail 401', function() {
        scope.register_user = {email: 'test@example.com', password: 'apassword', password_confirmation: 'bpassword'}; 
        scope.httpBackend.expect('POST', '../users.json', '{"user":{"email":"test@example.com","password":"apassword","password_confirmation":"bpassword"}}').respond(402, '');
        
        // call edit
        scope.register();
        
        scope.$digest();
        scope.httpBackend.flush();
        
        expect(scope.register_error.message).toEqual('Unexplained error, potentially a server error, please report via support channels as this indicates a code defect.  Server response was: ""');
        expect(scope.register_error.errors).toEqual({});
      });
    });

    describe('Change password: ', function(){
      // we only test 204 and 422, as those are our expected errors.  The others were covered in the submit testing
      it('success 204', function() {
        scope.register_user = {email: 'test@example.com', password: 'apassword', password_confirmation: 'bpassword'}; 
        scope.httpBackend.expect('PUT', '../users/password.json', '{"user":{"email":"test@example.com","password":"apassword","password_confirmation":"bpassword"}}').respond(204, '');
        
        // call edit
        scope.change_password();
        
        scope.$digest();
        scope.httpBackend.flush();
        
        expect(scope.register_error.message).toEqual('Your password has been updated.');
        expect(scope.register_error.errors).toEqual({});
      });

      it('fail 401', function() {
        scope.register_user = {email: 'test@example.com', password: 'apassword', password_confirmation: 'bpassword'}; 
        scope.httpBackend.expect('PUT', '../users/password.json', '{"user":{"email":"test@example.com","password":"apassword","password_confirmation":"bpassword"}}').respond(402, '');
        
        // call edit
        scope.change_password();
        
        scope.$digest();
        scope.httpBackend.flush();
        
        expect(scope.register_error.message).toEqual('Unexplained error, potentially a server error, please report via support channels as this indicates a code defect.  Server response was: ""');
        expect(scope.register_error.errors).toEqual({});
      });
    });
  });  
});