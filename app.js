
/**
 * Module dependencies.
 */
var express = require('express')
	, routes = require('./routes')
//	, user = require('./routes/user')
//	, item = require('./routes/item')
//	, upload = require('./routes/upload')
	, http = require('http');
//	, passport = require('passport')
//	, mongoose = require('mongoose');

var app = express();

//HTTP authentication scheme
var httpAuth = express.basicAuth(function(user, pass) {
 		return user === 'admin' && pass === 'granular crafty gidget';
	});

//set up the basic environment
require('./setupEnv')(app);
//app.use(passport.initialize());
//app.use(passport.session());
//router MUST come after passport. IDK.
app.use(app.router);

//var mongoose = require('mongoose');

// connect to db
// for local to work, mongod (mongodaemon) must be running on port 27017
//var uristring =
//	process.env.MONGOLAB_URI ||
//	process.env.MONGOHQ_URL  ||
//	'mongodb://localhost/HelloMongoose';
//	
//mongoose.connect(uristring, function (err, res) {
//	if (err) {
//		console.log ('ERROR connecting to: ' + uristring + '. ' + err);
//	} else {
//		console.log ('Succeeded connecting to: ' + uristring);
//		//Add seed data for videogames
//		require('./routes/populate.js')();
//	}
//});

//set up passport (better auth) using passport-local-mongoose plugin
//var Account = require('./models/Account.js');
//passport.use(Account.createStrategy());
//passport.serializeUser(Account.serializeUser());
//passport.deserializeUser(Account.deserializeUser());

//declare routing
app.get('/', routes.index);
app.get('/home', httpAuth, routes.test);
app.get('/partials/:partial', function(req, res) {
  res.render('partials/'+req.params.partial);
});

//start listening
http.createServer(app).listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});
