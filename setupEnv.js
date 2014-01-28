
var path = require('path')
		, express = require('express');

module.exports = function(app) {
	// all environments
	app.set('port', process.env.PORT || 3000);
	app.set('views', path.join(__dirname, 'views'));
	app.set('view engine', 'jade');
	app.use(express.favicon());
	app.use(express.logger('dev'));
	app.use(express.json());
	app.use(express.urlencoded());
	app.use(express.methodOverride());
	app.use(express.static(path.join(__dirname, 'public')));
	app.use(express.cookieParser());
	app.use(express.bodyParser());
	app.use(express.session({secret: 'casanova killed the hostel bar'}));
	
	// development only
	if ('development' == app.get('env')) {
		app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
	}
	
	if ('production' == app.get('env')) {
		app.use(express.errorHandler());
	}
}