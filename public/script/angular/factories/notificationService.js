app.factory('notificationService', ['sessionService', 'firebaseService', function(session, db) {
  
  var NOTIFICATION_MSG_TEMPLATES = {
    reservation: "Hey *-to-*, *-from-* has requested to reserve *-item-* at *-time-*.",
    purchase: "Hey *-to-*, *-from-* has purchased your *-item-*.",
    comment: "Hey *-to-*, *-from-* has commented on your post *-post-*!"
  };
  
  function fillTemplate(t, paramsObj) {
    /\*-(\W+)-\*/.match(t);
  }
  
  function notify(notificationData) {
    var data = { to: notificationData.to, of: notificationData.of };
    
    if(from) data.from = notificationData.from;
    else data.from = { displayName: "Outrovert Team" };
    
    $.post('/notifier', data)
    .done(function(res) {
      console.log(res);
    })
    .fail(function(err) {
      console.log(err.responseText);
    });
  }
  
  function notifyPurchase(purchaser, sellerUid, item) {
    var seller = db.getUserData(sellerUid, 'nocache');
    notify(seller, {type: 'purchase', item: item }, purchaser);
  }
  
  function notifyReservation(reserver, partnerUid, item) {
    var partner = db.getUserData(partnerUid, 'nocache');
    notify(partner, {type: 'reservation', item: item }, reserver);
  }
  
  function notifyComment(commenter, posterUid, post) {
    var poster = db.getUserData(posterUid, 'nocache');
    notify(poster, {type: 'comment', post: post }, commenter);
  }
  
  return {
    notify: {
      purchase: notifyPurchase,
      reservation: notifyReservation,
      comment: notfyComment
    }
  };
  
  //TODO: Uncle Dan's 15% discount
  
}]);
