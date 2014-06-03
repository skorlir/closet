app.controller('signup', [ '$scope', 'sessionService', 'firebaseService', '$window', function($scope, session, db, $window) {
  $scope.logemup = function() {
    var email = $scope.signupForm.email;
    var password = $scope.signupForm.password;
    var displayName = $scope.signupForm.firstName + ' ' + $scope.signupForm.lastName;
    var location = $scope.signupForm.location;
    
    if(! (email && password && (displayName !== ' ') && location) return false;
    
    session.emailSignup(email, password, function(u) {
      u.displayName = $scope.signupForm.firstName + ' ' + $scope.signupForm.lastName;
      u.location = $scope.signupForm.location;
      db.updateUserData(u);
      $window.location = '/home';
    });
  };
}]);