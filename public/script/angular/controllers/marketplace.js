app.controller('marketplace', ['$scope', 'sessionService', '$window', '$http', 'firebaseService', '$modal', 'restrictionService', function($scope, session, $window, $http, db, $modal, restrictionService) {
  //item.image item.poster.profilePicture item.poster.uid item.price item.description.name item.description.quality item.description.tags item.description.categories item.action item.location
  
  $scope.marketdb = db.getMarketplaceRef();
  
  $scope.marketplace = [];
  $scope.filterForm  = {};
  $scope.itemForm = {};
  
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
      console.log(item.restrictions);
      for (var r in item.restrictions) 
        if(!restrictionService.check(item.restrictions[r][0], item.restrictions[r][1])) 
          return false;
    }
    return (item.rentOrBuy == "Buy" && $scope.showBuy) 
                  || (item.rentOrBuy == "Rent" && $scope.showRent);
  };
  
  //TODO: modal cotrollers should be put in a factory or something.
  var modalController = function($scope, $modalInstance) {
    $scope.ok = function() {
      $modalInstance.close();
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
    
    modal.result.then(function() {
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
  
}]);