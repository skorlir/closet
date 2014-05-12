app.factory('sessionService',  ['firebaseService', '$firebaseSimpleLogin', '$rootScope', function(db, $firebaseSimpleLogin, $rootScope) {

  var auth = db.initWithRoot($firebaseSimpleLogin);

  var sessionUser, con;

  $rootScope.$on('$firebaseSimpleLogin:login', function(e, user) {

    var userData = db.getUserRef(user.uid);

    var userConnections = userData.$child('connections');
    var lastOnline = userData.$child('lastOnline');

    var UA = navigator.userAgent;
    var time = db.timestamp();

    if(!con) userConnections.$add({agent: UA, timestamp: time}).then(function(ref) {
      con = ref.name();
    
      db.updateUserData(user);
      sessionUser = db.getUserData(user.uid);
      $rootScope.loggedIn = true;
      $rootScope.user = sessionUser;
      console.log(sessionUser);
    });

    $rootScope.disconnect = function() {
      if(con) userConnections.$remove(con);
      lastOnline.$set(db.timestamp());
      
      $rootScope.loggedIn = false;
      sessionUser         = {};
    }
  });

  $rootScope.$on('$firebaseSimpleLogin:logout', function() {
    if($rootScope.disconnect) $rootScope.disconnect();
  });

  return {
    fbLogin: function(next) {
      return function() {
        auth.$login('facebook', {
          scope: 'email, user_location',
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
        console.log('logging out');
        auth.$logout();
        if(next) next();
      }
    },

    getUser: function(next) {
      return next(sessionUser || db.getUserData());
    }
  }
  
}]);