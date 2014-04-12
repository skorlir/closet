angular.module('outrovert', ['firebase'])
  .factory('databaseService', ['$firebase', '$firebaseSimpleLogin', '$rootScope', function($firebase, $firebaseSimpleLogin, $rootScope) {
    var root = new Firebase('https://sweltering-fire-110.firebaseio.com');
    var firebase = $firebase(root);
    var auth = $firebaseSimpleLogin(root);
    $rootScope.$on('$firebaseSimpleLogin:login', function(e, user) {
      
      var userData = firebase.$child('users/' + user.uid);
      
      userData.$on('value', function(snapshot) {
        if(!snapshot.name === user.displayName) 
          userData.$update({displayName: user.displayName});
      });

      var userConnections = userData.$child('connections');
      var lastOnline = userData.$child('lastOnline');
      
      var con;

      var UA = navigator.userAgent;
      var time = Firebase.ServerValue.TIMESTAMP;
      
      console.log(con);
      
      if(!con) userConnections.$add({agent: UA, timestamp: time}).then(function(ref) {
        con = ref.name();
        $rootScope.loggedIn = true;
      });
      
      $rootScope.disconnect = function() {
        if(con) userConnections.$remove(con);
      }
      
      $rootScope.$on('$firebaseSimpleLogin:logout', function() {
        console.log('remove connection pls', con);
        $rootScope.disconnect();
        console.log('set lastonline pls');
        lastOnline.$set(Firebase.ServerValue.TIMESTAMP);
        
        $rootScope.loggedIn = false;
      });
    });
    
    //var user = window.user || null;
    return {
      fbLogin: function(next) {
        return function() {
          auth.$login('facebook', {
            scope: 'email, publish_actions',
            rememberMe: true
          }).then(function(user) {
            next(user);
          }, function(error) {
            console.log(error);
          });
        }
      },
      
      logout: function(next) {
        return function() {
          console.log('logging out...?');
          auth.$logout();
          next();
        }
      }
    }
  }])
  .controller('activityFeed', ['$scope', 'databaseService', '$window', function($scope, db, $window) {
    
    $scope.fbLogin = db.fbLogin(function(user) {
      console.log('logged in as', user.uid, user.displayName);
    });
    
    $scope.logout = db.logout(function() {
      console.log('user logged out.');
    });
    
    //don't log out on leave, but do disconnect
    angular.element($window).bind('unload', function() {
      if($scope.disconnect) $scope.disconnect();
    });
    
  }]);