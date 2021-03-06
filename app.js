
/**
 * Module dependencies.
 */
var express = require('express')
	, routes = require('./routes')
	, http = require('http');

var app = express();

//HTTP authentication scheme
//var httpAuth = express.basicAuth(function(user, pass) {
// 		return (user === 'admin' && pass === 'granular crafty gidget') || (user === 'beta' && pass === "I'm an Outrovert");
//	});

//set up the basic environment
require('./setupEnv')(app);
//app.use(passport.initialize());
//app.use(passport.session());
//router MUST come after passport. IDK.
app.use(app.router);

//declare routing
app.get('/', routes.index);
app.get('/home', routes.test);
app.get('/partials/:partial', function(req, res) {
  res.render('partials/'+req.params.partial);
});
app.get('/aws0signature', routes.aws0signature);

app.post('/stripeCall', routes.stripeCall);

app.post('/transaction', routes.commitTransaction);
app.post('/nonfeature', routes.nonfeature);

//start listening
http.createServer(app).listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});
