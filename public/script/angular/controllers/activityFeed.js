app.controller('activityFeed', ['$scope', 'sessionService', '$window', '$http', 'firebaseService', function($scope, session, $window, $http, db) {
  
  $scope.activityForm = {};
  $scope.activityForm.message = '';
  
  $scope.activity = db.getActivityRef();
  $scope.feed = [];
  
  $scope.activity.$on('child_added', function(postSnap) {
    console.log(postSnap);
    if(postSnap.snapshot.value === null) return; //check should be unnecessary with input validation
    $scope.feed.unshift([postSnap.snapshot.name, postSnap.snapshot.value]);
  });
  
  session.getUser(function(user) {
    //TODO: file uploader factory.
    $scope.uploadFile = function(el) {
      $scope.imgToUpload = el.files[0];
      $scope.s3upload = new $window.S3Upload({
        s3_object_name: user.uid + '_' + el.files[0].name,
        s3_sign_put_url: 'aws0signature',
        file_dom_selector: null
      });
      $scope.fileElement = el;
    };
  });
  
  $scope.publishActivity = function() {
    var msg = $scope.activityForm.message;
    if (!msg) { $scope.flashMessage = 'Nothing to post!'; return; }
    session.getUser(function(user) {
      if (user === null) $scope.flashMessage = 'Error: Not logged in. Please refresh.';
      else {
        console.log(user);
        var post = {
            user: user.uid, 
            textContent: msg, 
            timestamp: db.timestamp(), 
            profilePictureM: user.profilePictureM,
            displayName: user.displayName
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
}]);