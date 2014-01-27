
/*
 * Handle user routings
 */

var Account = require('../models/Account.js');
var Subscriber = require('../models/Subscriber.js');
var _ = require('underscore');

exports.list = function(req, res){
	Subscriber.find({}).exec(function (err, result) {
		if(!err) {
				console.log(result);
				res.render('userlist', { users: result });
		} else { console.log('error: ' + err); }
	});
};

exports.addSub = function(req, res){
	var newSub = new Subscriber({ email: req.body.email });
	var e = false;
	newSub.save(function(err){ e = err; });
	
	res.send({isError: e, txt: 'Thanks! We\'ll be in touch.'});
};

exports.getRegister = function(req, res){
	//load a registration page
	res.render('register', { });
};

exports.postRegister = function(req, res){
	//register a new Account here
	Account.register(new Account({ username: req.body.username, 
															   email: req.body.email }),
									 req.body.password,
									 function(err, account) {
										if (err) {
											return res.render('register', { account: account });
										}
										 
										 passport.authenticate('local')(req, res, function() {
											 res.redirect('/');
										 });
									 });
};

exports.getLogin = function(req, res){
	//load up a login page
	res.render('login', { });
}

exports.postLogin = function(req, res) {
	//user specific logic will need to be specified in routing
	res.redirect('/users/' + req.user);
}

exports.dash = function(req, res){
	//produce user dashboard
	res.render('dashboard', { user: req.user });
}