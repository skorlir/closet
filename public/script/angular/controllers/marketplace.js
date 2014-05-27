app.controller('marketplace', ['$scope', 'sessionService', '$window', '$http', 'firebaseService', '$modal', 'restrictionService', '$filter', function($scope, session, $window, $http, db, $modal, restrictionService, $filter) {
  //item.image item.poster.profilePicture item.poster.uid item.price item.description.name item.description.quality item.description.tags item.description.categories item.action item.location
  
  $scope.marketdb = db.getMarketplaceRef();
  
  $scope.marketplace = [];
  $scope.filterForm  = {};
  $scope.itemForm = {};

  session.getUser(function(user) {
    $scope.hasNUEmail = function() {
        var email = [];
        if(user.restrictions) email = user.restrictions.email;
        else email = [user.email];
        email = $filter('orderByPriority')(email);
        return !!email.filter(function(em) { return em.indexOf('northwestern.edu') > -1; }).length;
    }
  });
  
  $scope.addNorthwesternEmail = function(email) {
    session.getUser(function(user) {
      db.addRestrictionProp('email', email, user.uid);
      restrictionService.setUser(user);
    });
  }
  
  $scope.marketdb.$on('child_added', function(itemSnap) {
    console.log(itemSnap);
    if(itemSnap.snapshot.value === null) return;
    $scope.marketplace.unshift(itemSnap.snapshot.value);
  });
  
  $scope.toggleBtns = function(which) {
    //FIXME: this feels convoluted
    if ( which === 'buy' ) {
      $scope.showBuy = true;
      $scope.showRent = !$scope.showRent;
    }
    else {
      $scope.showRent = true; 
      $scope.showBuy  = !$scope.showBuy;
    }
    if(! ($scope.showBuy || $scope.showRent) ) $scope.showBuy = $scope.showRent = true;
  };
  
  session.getUser(function(user) {
    restrictionService.setUser(user);
  });
    
  $scope.showHide = function(item) {
    if(item.restrictions) {
      for (var r in item.restrictions) 
        if(!restrictionService.check(item.restrictions[r][0], item.restrictions[r][1])) 
          return false;
    }
    return (item.rentOrBuy.toLowerCase() == "buy" && $scope.showBuy) 
                  || (item.rentOrBuy.toLowerCase() == "rent" && $scope.showRent);
  };
  
  //TODO: modal cotrollers should be put in a factory or something.
  var modalController = function($scope, $modalInstance) {
    $scope.result = {};
    
    $scope.ok = function() {
      $modalInstance.close($scope.result);
    };
    
    $scope.cancel = function() {
      $modalInstance.dismiss();
    };
  };
  
  $scope.openTransaction = function(r) {
    var modal = $modal.open({
      templateUrl: 'modal.html',
      controller:  modalController
    });
    
    modal.result.then(function(result) {
      //confirmation == whatever is passed in. So nothing?
      //send an email with node-mailer
      session.getUser(function(user) {
        $http.post('/transaction', {user: user, r: r})
        .success(function(res) {
          console.log("the transaction was committed.");
          //should do something to prevent double transactions?!
        })
        .error(function(error) {
          console.log(error);
        });
      });
      
    }, function(cancellation) {
      //nothing needs done here...
      console.log("cancel!");
    });
  };
  
//  $scope.addEmail = function() {
//    var modal = $modal.open({
//     templateUrl: 'emailModal.html',
//     controller: modalController
//    });
//
//    modal.result.then(function(result) {
//     session.getUser(function(user) {
//       console.log("hello?");
//       db.addRestrictionProp('email', result.email, user.uid);
//     });
//    });
//  };
  
}]);