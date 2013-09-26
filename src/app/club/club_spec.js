/**
 * Unit tests for the club functionality
 */
describe( 'Club controller', function() {
  //mock Application to allow us to inject our own dependencies
  beforeEach(angular.mock.module('league'));

  //mock the controller for the same reason and include $rootScope and $controller
  beforeEach(angular.mock.inject(function($rootScope, $controller){
    //create an empty scope
    scope = $rootScope.$new();

    //declare the controller and inject our empty scope
    $controller('ClubCtrl', {$scope: scope});
  }));

  // tests start here
  it('Has two clubs defined', function(){
    expect(scope.clubs.length).toBe(2);
  });  
});