app.controller('myGear', ['$scope', 'sessionService', 'firebaseService', '$window', '$location', function($scope, session, db, $window, $location) {
  session.getUser(function(user) {
    
    $scope.uploadFile = function(el) {
      $scope.imgToUpload = el.files[0];
      session.getUser(function(user) {
        $scope.s3upload = new $window.S3Upload({
          s3_object_name: user.uid + '_' + $scope.imgToUpload.name,
          s3_sign_put_url: 'aws0signature',
          file_dom_selector: null
        });
      });
      $scope.fileElement = el;
    };
    
    $scope.myGear = [];
    $scope.addGearForm = {};

    var myGearDB = db.getUserRef(user.uid).$child('/gear');
    console.log(myGearDB);
    var marketDB = db.getMarketplaceRef();

    myGearDB.$on('child_added', function(gearSnap) {
      console.log(gearSnap);
      if(gearSnap.snapshot.value === null) return;
      $scope.myGear.unshift([gearSnap.snapshot.name, gearSnap.snapshot.value]);
    });

    $scope.addGear = function() {
      $scope.s3upload.onFinishS3Put = function(public_url) {
        var item = {
          name: $scope.addGearForm.name,
          description: $scope.addGearForm.description,
          condition: $scope.addGearForm.condition,
          price: $scope.addGearForm.price,
          rentOrBuy: $scope.addGearForm.rentalOrSale === 'Sale' ? 'Buy' : 'Rent',
          image: public_url,
          location: user.location || user.hometown
        }
        
        var poster = {
          uid: user.uid,
          profilePicture: 'http://graph.facebook.com/' + user.id + '/picture?type=small'
        }
        var itemRef = myGearDB.$add(item);
        
        itemRef.then(function(gear) {
          marketDB.$child(gear.name()).$set({item: item, poster: poster});
        });
        
        $scope.addGearForm = {};
        $scope.fileElement.value = '';
      };
      $scope.s3upload.uploadFile($scope.imgToUpload);
    }
  
    $scope.deleteGear = function (key) {
      myGearDB.$remove(key);
      marketDB.$remove(key);
      $scope.myGear.splice($scope.myGear.indexOf($scope.myGear.filter(function(el) { return el[0] === key; })[0]), 1);
    }
  });
  
}]);