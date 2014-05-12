app.factory('firebaseService', ['$firebase', function($firebase) {
  //sweltering-fire-110
  var serverUri = window.developmentMode ? 'https://outrovert-testing.firebaseio.com' : 
                                        'https://sweltering-fire-110.firebaseio.com';
  var root     = new Firebase(serverUri);
  var firebase = $firebase(root);
  
  function databaseManager() {
    this.refreshCache    = true;
    this.userDataCache   = {};
    
    if(window.developmentMode) {
      this.root = function()         { return root; };
      this.get$firebase = function() { return firebase; };
    }
    
    this.timestamp = function() { return Firebase.ServerValue.TIMESTAMP; }
    
    this.getUserRef = function(uid) { return firebase.$child('/users/'+uid); }
    this.getActivityRef = function() { return firebase.$child('/activity'); }
    this.getMarketplaceRef = function() { return firebase.$child('/marketplace'); }
    
    this.getUserData = function(uid) {
      if(!this.refreshCache && this.userDataCache) return this.userDataCache;
      
      var userRef = firebase.$child('/users/'+uid);
      
      for (var prop in userRef)
        if (prop[0] !== '$') this.userDataCache[prop] = userRef[prop];
      
      return (this.refreshCache = false, this.userDataCache);
    }
    
    this.updateUserData = function(user) {
      var userRef = firebase.$child('/users/'+user.uid);
      
      var providerData   = user.thirdPartyUserData;
      var profilePicture = 'http://graph.facebook.com/%/picture'.split('%').join(user.id);
      
      userRef.$update({'displayName': user.displayName});
      userRef.$update({'location': (providerData.location ? providerData.location.name : null)});
      userRef.$update({'hometown': (providerData.hometown ? providerData.hometown.name : null)});
      userRef.$update({'email': providerData.email});
      userRef.$update({'profilePictureM': profilePicture});
      userRef.$update({'profilePicture': profilePicture + '?type=small'});
      
      this.refreshCache = true;
    }
    
    this.initWithRoot = function(func) {
      return func(root);
    }
    
  }
  
  return new databaseManager();
  
}]);