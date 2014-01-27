
/*
 * Handle user routings
 */

var Account = require('../models/Account.js');
var Subscriber = require('../models/subscribers.js');

exports.list = function(req, res){
	Subscriber.find({}).exec(function (err, result) {
		if(!err) {
				console.log(result);
				res.render('userlist', { users: result });
		} else { console.log('error: ' + err); }
	});
};

exports.add = function(req, res){
	var newSub = new Subscriber({ email: req.body.email });
	var e = false;
	newSub.save(function(err){ e = err; });
	
	res.send({isError: e, txt: 'Thanks! We\'ll be in touch.'});
};