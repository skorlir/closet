var router = function($routeProvider) {
  $routeProvider.when('/', {
    templateUrl: '/partials/activityFeed',
    controller: 'activityFeed'
  });
  $routeProvider.when('/marketplace', {
    templateUrl: '/partials/marketplace',
    controller: 'marketplace'
  });
  $routeProvider.when('/mygear', {
    templateUrl: '/partials/myGear',
    controller: 'myGear'
  });
}

angular.module('outrovert', ['firebase', 'ngRoute', 'ui.bootstrap'], router)
.factory('firebaseService', ['$firebase', function($firebase) {
  var root = new Firebase('https://sweltering-fire-110.firebaseio.com');
  var firebase = $firebase(root);
  
  return {
    root: function() { return root; },
    get$firebase: function() { return firebase; },
    timestamp: function() { return Firebase.ServerValue.TIMESTAMP; }
  }
}])
.factory('sessionService',  ['firebaseService', '$firebaseSimpleLogin', '$rootScope', function(db, $firebaseSimpleLogin, $rootScope) {

  var root = db.root();
  var firebase = db.get$firebase();
  
  var auth = $firebaseSimpleLogin(root);

  $rootScope.$on('$firebaseSimpleLogin:login', function(e, user) {

    var userData = firebase.$child('users/' + user.uid);

    userData.$on('value', function(snapshot) {
      if(!snapshot.snapshot.value.displayName === user.displayName) 
        userData.$update({displayName: user.displayName});
    });

    var userConnections = userData.$child('connections');
    var lastOnline = userData.$child('lastOnline');

    var con;

    var UA = navigator.userAgent;
    var time = db.timestamp();

    //console.log(con);

    if(!con) userConnections.$add({agent: UA, timestamp: time}).then(function(ref) {
      con = ref.name();
      $rootScope.loggedIn = true;
      $rootScope.displayName = user.displayName;
      $rootScope.profilePicture = 'http://graph.facebook.com/'+user.id+'/picture?type=small';
      $rootScope.profilePictureM = 'http://graph.facebook.com/'+user.id+'/picture';
    });

    $rootScope.disconnect = function() {
      if(con) userConnections.$remove(con);
      lastOnline.$set(Firebase.ServerValue.TIMESTAMP);
    }

    $rootScope.$on('$firebaseSimpleLogin:logout', function() {
      console.log('remove connection pls', con);
      $rootScope.disconnect();
      console.log('set lastonline pls');        
      $rootScope.loggedIn = false;
      $rootScope.displayName = '';
      $rootScope.profilePicture = '';
      $rootScope.profilePictureM = '';
    });
  });

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
    },

    getUser: function() {
      return auth.$getCurrentUser();
    }
  }
}])

.controller('base', ['$scope', 'sessionService', '$window', function($scope, session, $window) {

  $scope.fbLogin = session.fbLogin(function(user) {
    console.log('logged in as', user.uid, user.displayName);
  });

  $scope.logout = session.logout(function() {
    console.log('user logged out.');
  });

  //don't log out on leave, but do disconnect
  angular.element($window).bind('unload', function() {
    if($scope.disconnect) $scope.disconnect();
  });

}])

.controller('activityFeed', ['$scope', 'sessionService', '$window', '$http', 'firebaseService', function($scope, session, $window, $http, db) {
  
  $scope.activityForm = {};
  $scope.activityForm.message = '';
  
  $scope.activity = db.get$firebase().$child('/activity');
  $scope.feed = [];
  
  $scope.activity.$on('child_added', function(postSnap) {
    console.log(postSnap);
    if(postSnap.snapshot.value === null) return;
    //if($.inArray(postSnap.snapshot.value, $scope.feed) > -1) return;
    $scope.feed.unshift(postSnap.snapshot.value);
  });
  
  //also what about removed?
  
  $scope.publishActivity = function() {
    var msg = $scope.activityForm.message;
    if (!msg) { $scope.flashMessage = 'Nothing to post!'; return; }
    session.getUser().then(function(user) {
      if (user === null) $scope.flashMessage = 'Error: Not logged in. Please refresh.';
      else {
        $scope.activity.$add({user: user.uid, textContent: msg, timestamp: db.timestamp(), profilePictureM: $scope.profilePictureM, displayName: $scope.displayName});
      }
    });
  }
}])

.controller('marketplace', ['$scope', 'sessionService', '$window', '$http', 'firebaseService', function($scope, session, $window, $http, db) {
  //item.image item.poster.profilePicture item.poster.uid item.price item.description.name item.description.quality item.description.tags item.description.categories item.action item.location
  
  $scope.marketdb = db.get$firebase().$child('/marketplace');
  
  $scope.marketplace = [];
  $scope.filterForm  = {};
  $scope.itemForm = {};
  
  //https://maps.googleapis.com/maps/api/geocode/json?address=Mountain+View,+CA&sensor=true_or_false&key=API_KEY
  //key - AIzaSyAcDx9pk4zK3vgneoV0Dv-81memVX3TOtM
  
  $scope.marketdb.$on('child_added', function(itemSnap) {
    console.log(itemSnap);
    if(itemSnap.snapshot.value === null) return;
    $scope.marketplace.unshift(itemSnap.snapshot.value);
  });
  
  $scope.showHide = function(type) {
    return (type == "Buy" && $scope.showBuy) || (type == "Rent" && $scope.showRent);
  }
  
}])

.controller('myGear', ['$scope', 'sessionService', '$http', 'firebaseService', '$window', function($scope, session, $http, db, $window) {
  session.getUser().then(function(user) {
    
    if(user === null) {
      console.log("not logged in");
      return;
    }
    
    $scope.myGear = [];
    $scope.addGearForm = {};

    var myGearDB = db.get$firebase().$child('/users/'+user.uid + '/gear');
    var marketDB = db.get$firebase().$child('/marketplace');

    myGearDB.$on('child_added', function(gearSnap) {
      console.log(gearSnap);
      if(gearSnap.snapshot.value === null) return;
      $scope.myGear.unshift(gearSnap.snapshot.value);
    });

    $scope.addGear = function() {
      $scope.s3upload.onFinishS3Put(function(public_url) {
          var item = {
          name: $scope.addGearForm.name,
          description: $scope.addGearForm.description,
          quality: $scope.addGearForm.quality,
          price: $scope.addGearForm.price,
          rentOrBuy: $scope.addGearForm.rentalOrSale === 'Sell' ? 'Buy' : 'Rent',
          image: public_url
        }
        var poster = {
          uid: user.uid,
          profilePicture: 'http://graph.facebook.com/' + user.id + '/picture?type=small'
        }
        myGearDB.$add(item);
        marketDB.$add({item: item, poster: poster});
      });
      $scope.s3upload.uploadFile($scope.imgToUpload);
    }
    
    $scope.uploadFile = function(files) {
      //send s3_object_name and s3_object_type as GET params
      $scope.imgToUpload = files[0];
      $scope.s3upload = new $window.S3Upload({
        s3_object_name: user.uid + '_' + $scope.imgToUpload.name,
        s3_sign_put_url: 'aws0signature',
        file_dom_selector: null
      });
    };
  });
  
}]);

