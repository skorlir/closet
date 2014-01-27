
/**
 * Module dependencies.
 */
var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');

var app = express();

//HTTP authentication scheme
var auth = express.basicAuth(function(user, pass) {
 		return user === 'admin' && pass === 'granular crafty gidget';
	});

//set up the basic environment
require('./setupEnv')(app);
app.use(passport.initialize());
app.use(passport.session());

var mongoose = require('mongoose');

// connect to db
var uristring =
	process.env.MONGOLAB_URI ||
	process.env.MONGOHQ_URL ||
	'mongodb://localhost/HelloMongoose';
	
mongoose.connect(uristring, function (err, res) {
if (err) {
	console.log ('ERROR connecting to: ' + uristring + '. ' + err);
} else {
	console.log ('Succeeded connected to: ' + uristring);
}
});

//set up passport (better auth)
var Account = require('./models/Account.js');
passport.use(new LocalStrategy(Account.authenticate()));
passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());

//declare routing
app.get('/', routes.index);
app.get('/users', auth, user.list);
app.get('/users/:id', passport.authenticate('local'), user.dash);
app.post('/users/subscribers', user.addSub);
app.get('/register', user.getRegister);
app.post('/register', user.postRegister);
app.get('/login', user.getLogin);
app.post('/login', user.postLogin);

//start listening
http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
