app.factory('notificationService', ['sessionService', 'firebaseService', function(session, db) {
  //notify a given uid of an event
  //so notify uid of transaction
  
  function notify(to, of, from) {
    var toUser = db.getUserData(to, 'nocache');
    
    var data = {};
    
    data.to = toUser;
    if(from) data.from = from;
    data.of = of;
    
    $.post('/notifier', data)
    .done(function(res) {
      console.log(res);
    })
    .fail(function(err) {
      console.log(err.responseText);
    });
  }
  
  function notifyPurchase(purchaser, sellerUid) {
    notify(sellerUid, 
  }
  
  return {
    
  };
  
}]);
