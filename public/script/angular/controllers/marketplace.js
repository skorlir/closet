app.controller('marketplace', ['$scope', 'sessionService', '$window', '$http', 'firebaseService', '$modal', 'restrictionService', '$filter', 'notificationService', function($scope, session, $window, $http, db, $modal, restrictionService, $filter, notif) {
  //item.image item.poster.profilePicture item.poster.uid item.price item.description.name item.description.quality item.description.tags item.description.categories item.action item.location
  
  $scope.marketdb = db.getMarketplaceRef();
  
  $scope.marketplace = [];
  $scope.filterForm  = {};
  $scope.itemForm = {};
  $scope.showBuy = $scope.showRent = true;
  
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
    console.log($scope.showRent);
    console.log($scope.showBuy);
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
  
  $scope.stripeCheckout = StripeCheckout.configure({
    key: 'pk_test_7uHnkwHduxs0TfbzUy4LSZD4',
    image: '/images/logoAssets/favicon-160.png',
    token: function(token, args) {
      // Use the token to create the charge with a server-side script.
      // You can access the token ID with `token.id`
    }
  });
  
  $scope.openTransaction = function(r) {
    console.log(r);
    $scope.stripeCheckout.open({
      name: 'Outrovert',
      description: r.item.name,
      amount: r.item.price * 100,
      email: $scope.user.email,
      token: function(token, args) {
        var data = {
          stripeToken: token,
          item: r.item,
          seller: r.poster,
          purchaser: $scope.user
        };
        $.post()
      }
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