angular.module( 'league', [
  'templates-app',
  'templates-common',
  'common.error_handling',
  'common.authentication',
  'pascalprecht.translate',
  'angularTranslateApp',
  'league.home',
  'league.about',
  'league.club',
  'league.team',
  'league.login',
  'ui.state',
  'ui.route'
])

.config( function myAppConfig ( $stateProvider, $urlRouterProvider ) {
  $urlRouterProvider.otherwise( '/home' );
})

.run( function run () {
})

.controller( 'AppCtrl', function AppCtrl ( $scope, $location ) {
  $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
    if ( angular.isDefined( toState.data.pageTitle ) ) {
      $scope.pageTitle = toState.data.pageTitle + ' | ngBoilerplate' ;
    }
  });
})
;