app.controller('base', ['$scope', 'sessionService', '$window', '$modal', '$http', '$filter', 'firebaseService', 'restrictionService', '$rootScope', 'notificationService', '$position',  function($scope, session, $window, $modal, $http, $filter, db, restrictionService, $rootScope, notif) {
  
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
      if(!email) return;
      db.addRestrictionProp('email', email, user.uid);
      $window.location.reload();
      
      //TODO: make the below work
      
//      $.post('/emailVerifier', {user: $scope.user, email: email})
//      .done(function(res) {
//        console.log(res);
//      })
//      .fail(function(err) {
//        console.log(err.responseText);
//      });
    }
    
    $scope.warning = function(text) {
      var warning = $('<div>'+text+'</div>');
      warning.css({position: 'fixed', 
                   bottom: '0', 
                   left: '0', 
                   width: '100%', 
                   background: 'rgb(235, 62, 73)', 
                   color: 'white', 
                   'text-shadow' : '1px 1px 1px #bbb', 
                   display: 'none', 
                   'font-size': '150%',
                   'text-align': 'center',
                   padding: '10px'
                  });
      $('body').append(warning);
      warning.fadeIn();
      setTimeout(function() { warning.fadeOut() }, 4000);
    }
    
    $scope.needEmailWarning = function() { 
      $scope.warning("You need a Northwestern email before you can do that!");
    };
    
  }

}]);
