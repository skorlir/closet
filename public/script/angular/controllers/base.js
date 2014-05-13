app.controller('base', ['$scope', 'sessionService', '$window', '$modal', '$http', '$position', function($scope, session, $window, $modal, $http) {

  $scope.fbLogin = session.fbLogin(function(user) {
    console.log('logged in as', user.uid, user.displayName);
  });

  $scope.logout = session.logout();

  //don't log out on leave, but do disconnect
  angular.element($window).bind('unload', function() {
    if($scope.disconnect) $scope.disconnect();
  });
  
  var nonfeatureController = function($scope, $modalInstance) {
    $scope.ok = function() {
      $modalInstance.close();
    };
  };
  
  $scope.warnNonFeature = function(thing) {
    var modal = $modal.open({
      templateUrl: 'nonfeature.html',
      controller: nonfeatureController
    });
    
    modal.result.then(function() {
      $http.post('/nonfeature', {data: thing});
    });
  }
}]);