app.controller('signup', [ '$scope', 'sessionService', '$location', function($scope, session, $location) {
  $scope.logemup = function() {
    var email = $scope.signupForm.email;
    var password = $scope.signupForm.password;
    session.emailSignup(email, password, function() {
      console.log('holy crap batman');
      $location.path('/home#/');
    });
  };
}]);