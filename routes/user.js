
/*
 * Handle user routings
 */

var Account = require('../models/Account.js');
var Subscriber = require('../models/Subscriber.js');
var passport = require('passport');

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
	
	res.send({error: e, txt: 'Thanks! We\'ll be in touch.'});
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
											console.log(err);
											return res.send({error: err});
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
	//user specific logic is specified in routing
	//TODO: this is kinda gross. Shouldn't really be sending the page this way, but just redirecting. I think if I change it it'll cascade though, so I'll leave it for now.
	res.send('/');
}

exports.profile = function(req, res) {
	if(req.params.userid) {
		Account.find({_id: req.params.userid}, function(err, result) {
			res.render('profile', { user: result });
		});
	} else {
		req.isAuthenticated() ? res.render('profile', { user: req.user }) : res.redirect('/login');
	}
}

exports.getName = function (req, res) {
	if(req.params.userid) {
		Account.find({_id: req.params.userid}, 'username', function(err, result) {
			if(err) console.log(err);
			console.log('getname: '+result);
			res.send(result);
		});
	}
}

exports.getPhoto = function (req, res) {
	if(req.params.userid) {
		Account.find({_id: req.params.userid}, 'profilePhoto', function(err, result) {
			if(err) console.log(err);
			console.log('getphoto: '+result);
			res.send('../../images/'+result);
		});
	}
}
