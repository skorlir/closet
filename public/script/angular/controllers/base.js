app.controller('base', ['$scope', 'sessionService', '$window', '$modal', '$http', '$filter', 'firebaseService', 'restrictionService', '$rootScope', '$location', '$position',  function($scope, session, $window, $modal, $http, $filter, db, restrictionService, $rootScope, $location) {
  
  console.log($location);
  if($window.location.pathname == '/') {
    session.getUser(function(user) {
      if(!!user) $window.location = '/home';
    });
  }

  $scope.fbLogin = session.fbLogin(function(user) {
    console.log('logged in as', user.uid, user.displayName);
    afterLogin(user);
  });
  
  $scope.loginForm = {};
  
  $scope.emailLogin = session.emailLogin(function(user) {
    console.log('logged in as', user.uid, user.email);
    afterLogin(user);
  });

  $scope.logout = session.logout();
  
  session.getUser(function(user) {
    
    if(!!user) afterLogin(user);
    
  });

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
    
  function afterLogin(user) {
    
    $scope.hasNUEmail = function() {
      var email = [];
      if(user.restrictions) email = user.restrictions.email;
      else email = [user.email];
      email = $filter('orderByPriority')(email);
      return !!email.filter(function(em) { return em.indexOf('northwestern.edu') > -1; }).length;
    }

    $scope.addNorthwesternEmail = function(email) {
      db.addRestrictionProp('email', email, user.uid);
      restrictionService.setUser(user);
    }
    
  }

}]);
