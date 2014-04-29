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
    console.log(user);
    
    if(user.displayName)
      userData.$update({displayName: user.displayName});
    if(user.thirdPartyUserData.location)
      userData.$update({location: user.thirdPartyUserData.location.name});
    if(user.thirdPartyUserData.hometown)
      userData.$update({hometown: user.thirdPartyUserData.hometown.name});

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
      $rootScope.location = user.location;
      $rootScope.hometown = user.hometown;
    });

    $rootScope.disconnect = function() {
      if(con) userConnections.$remove(con);
      lastOnline.$set(Firebase.ServerValue.TIMESTAMP);
    }

    $rootScope.$on('$firebaseSimpleLogin:logout', function() {
      $rootScope.disconnect();
      $rootScope.loggedIn = false;
      $rootScope.displayName = '';
      $rootScope.profilePicture = '';
      $rootScope.profilePictureM = '';
      $rootScope.location = '';
      $rootScope.hometown = '';
    });
  });

  return {
    fbLogin: function(next) {
      return function() {
        auth.$login('facebook', {
          scope: 'email, publish_actions, user_location',
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
  
  session.getUser().then(function(user) {
    $scope.uploadFile = function(el) {
      $scope.imgToUpload = el.files[0];
      $scope.s3upload = new $window.S3Upload({
        //NOTE: encodeURIComponent is key here: if the object_name is all
        //  escaped, that causes errors
        //  only the imgToUpload.name MUST be escaped
        s3_object_name: user.uid + '_' + $scope.imgToUpload.name,
        s3_sign_put_url: 'aws0signature',
        file_dom_selector: null
      });
      $scope.fileElement = el;
    };
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
    $scope.feed.unshift([postSnap.snapshot.name, postSnap.snapshot.value]);
  });
  
  //also what about removed?
  
  $scope.publishActivity = function() {
    var msg = $scope.activityForm.message;
    if (!msg) { $scope.flashMessage = 'Nothing to post!'; return; }
    session.getUser().then(function(user) {
      if (user === null) $scope.flashMessage = 'Error: Not logged in. Please refresh.';
      else {
        var post = {
            user: user.uid, 
            textContent: msg, 
            timestamp: db.timestamp(), 
            profilePictureM: $scope.profilePictureM, 
            displayName: $scope.displayName
        };
        if($scope.s3upload) {
          $scope.s3upload.onFinishS3Put = function(public_url) {
            post.photo = public_url;
            $scope.activity.$add(post);
            $scope.fileElement.value = '';
            $scope.activityForm = {};
          };
          $scope.s3upload.uploadFile($scope.imgToUpload);
        } else {
          $scope.activity.$add(post);
          $scope.activityForm = {};
        }
      }
    });
  }
  
  $scope.deletePost = function(postid) {
    console.log(postid);
    $scope.activity.$remove(postid).then(function(res) {
      console.log(res, 'removed');
      $scope.feed.splice($scope.feed.indexOf($scope.feed.filter(function(el) {  return el[0] === postid; })[0]), 1);
    });
  }
}])

.controller('marketplace', ['$scope', 'sessionService', '$window', '$http', 'firebaseService', function($scope, session, $window, $http, db) {
  //item.image item.poster.profilePicture item.poster.uid item.price item.description.name item.description.quality item.description.tags item.description.categories item.action item.location
  
  $scope.marketdb = db.get$firebase().$child('/marketplace');
  
  $scope.marketplace = [];
  $scope.filterForm  = {};
  $scope.itemForm = {};
  
  $scope.filterNames = function(expected, given) {
    console.log(expected);
    console.log(given);
    return true;
  };
  
  $scope.marketdb.$on('child_added', function(itemSnap) {
    console.log(itemSnap);
    if(itemSnap.snapshot.value === null) return;
    $scope.marketplace.unshift(itemSnap.snapshot.value);
  });
  
  $scope.toggleBtns = function(which) {
    which === "showBuy" ? 
      $scope.showRent = $scope.showBuy === true ? true : false 
    : $scope.showBuy = $scope.showRent === true ? true : false;
  };
  
  $scope.showHide = function(type) {
    return (type == "Buy" && $scope.showBuy) || (type == "Rent" && $scope.showRent);
  };
  
}])

.controller('myGear', ['$scope', 'sessionService', '$http', 'firebaseService', '$window', '$location', function($scope, session, $http, db, $window, $location) {
  session.getUser().then(function(user) {
    
    if(user === null) {
      console.log("not logged in");
      $location.path('/');
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
      $scope.s3upload.onFinishS3Put = function(public_url) {
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
        
        $scope.addGearForm = {};
        $scope.fileElement.value = '';
      };
      $scope.s3upload.uploadFile($scope.imgToUpload);
    }
  });
  
}]);

