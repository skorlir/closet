app.factory('notificationService', ['sessionService', 'firebaseService', function(session, db) {
  
  var NOTIFICATION_MSG_TEMPLATES = {
    reservation: "Hey *-to-*, *-from-* has requested to reserve *-item-* at *-time-*.",
    purchase: "Hey *-to-*, *-from-* has purchased your *-item-*.",
    comment: "Hey *-to-*, *-from-* has commented on your post *-content-*!",
    message: "*-from-* says: *-content-*"
  };
  
  function fillTemplate(t, paramsObj) {
    t = NOTIFICATION_MSG_TEMPLATES[t];
    t = t.replace(/\*-(\w+)-\*/g, function(match, capture, index, origString) {
      return paramsObj[capture].displayName || paramsObj[capture].name || paramsObj[capture];
    });
    
    return t;
  }
  
  function notify(to, of, from) {
    var data = { unread: true, to: to };
    
    for(var prop in of) {
      data[prop] = of[prop];
    }
    
    if(from) data.from = from.displayName;
    else data.from = "Outrovert Team";
    
    of.text = fillTemplate(of.type, data);
    
    var toRef = db.getUserRef(to.uid);
    
    toRef.$child('/notifications').$add(of);
    
//    $.post('/notifier', data)
//    .done(function(res) {
//      console.log(res);
//    })
//    .fail(function(err) {
//      console.log(err.responseText);
//    });
  }
  
  function notifyPurchase(sellerUid, item, purchaser) {
    var seller = db.getUserData(sellerUid, 'nocache');
    notify(seller, {type: 'purchase', item: item }, purchaser);
  }
  
  function notifyReservation(partnerUid, item, reserver) {
    var partner = db.getUserData(partnerUid, 'nocache');
    notify(partner, {type: 'reservation', item: item }, reserver);
  }
  
  function notifyComment(posterUid, post, commenter) {
    var poster = db.getUserData(posterUid, 'nocache');
    notify(poster, {type: 'comment', content: post }, commenter);
  }
  
  function notifyMessage(receiverUid, msg, sender) {
    var receiver = db.getUserData(receiverUid, 'nocache');
    notify(receiver, {type: 'message', content: msg}, sender);
  }
  
  return {
    notify: {
      purchase: notifyPurchase,
      reservation: notifyReservation,
      comment: notifyComment,
      message: notifyMessage
    }
  };
  
  //TODO: Uncle Dan's 15% discount
  
}]);
