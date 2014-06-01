app.factory('firebaseService', ['$firebase', function($firebase) {
  //sweltering-fire-110
  var serverUri = window.developmentMode ? 'https://outrovert-testing.firebaseio.com' : 
                                        'https://sweltering-fire-110.firebaseio.com';
  var root     = new Firebase(serverUri);
  var firebase = $firebase(root);
  
  function databaseManager() {
    this.userDataCache   = {};
    
    if(window.developmentMode) {
      this.root = function()         { return root;     };
      this.get$firebase = function() { return firebase; };
    }
    
    this.timestamp = function() { return Firebase.ServerValue.TIMESTAMP; }
    
    this.getUserRef = function(uid) { return firebase.$child('/users/'+uid); }
    this.getActivityRef = function() { return firebase.$child('/activity'); }
    this.getMarketplaceRef = function() { return firebase.$child('/marketplace'); }
    
    this.getUserData = function(uid) {      
      var userRef = firebase.$child('/users/'+uid);
      
      for (var prop in userRef)
        if (prop[0] !== '$') this.userDataCache[prop] = userRef[prop];
      
      return this.userDataCache;
    }
    
    this.updateUserData = function(user) {
      var userRef = firebase.$child('/users/'+user.uid);
      
      var provider = user.provider;
      var providerData   = user.thirdPartyUserData || user;
      var profilePicture;
      
      if(provider == 'facebook') {
      
        user.location        = providerData.location ? providerData.location.name : null;
        user.hometown        = providerData.hometown ? providerData.hometown.name : null;
        user.email           = providerData.email;
        user.profilePictureM = 'http://graph.facebook.com/%/picture'.split('%').join(user.id);
        user.profilePicture  = user.profilePictureM + '?type=small';
        
      } 
      
      userRef.$update({'displayName': user.displayName});
      userRef.$update({'location': user.location});
      userRef.$update({'hometown': user.hometown});
      userRef.$update({'email': user.email});
      userRef.$update({'profilePictureM': user.profilePictureM ? user.profilePictureM : user.profilePicture});
      userRef.$update({'profilePicture': user.profilePicture});
      userRef.$update({'id': user.id});
      userRef.$update({'uid': user.uid});
    }
    
    this.setUserProp = function(prop, val, uid) {
      var userRef = firebase.$child('/users/'+uid);
      
      var updateData = {};
      updateData[prop] = val;
      userRef.$update(updateData);
      this.userDataCache[prop] = val;
    }
    
    this.addRestrictionProp = function(prop, val, uid) {
      var restrictionsRef = firebase.$child('/users/'+uid+'/restrictions');
      
      restrictionsRef.$child('/'+prop).$add(val);
      if(!this.userDataCache.restrictions) this.userDataCache.restrictions = {};
      for(var prop in restrictionsRef){
        if(prop[0] !== '$') {
          if(!this.userDataCache.restrictions[prop]) this.userDataCache.restrictions[prop] = [];
          this.userDataCache.restrictions[prop] = restrictionsRef[prop];
        }
      }
    }
    
    this.initWithRoot = function(func) {
      return func(root);
    }
    
  }
  
  return new databaseManager();
  
}]);