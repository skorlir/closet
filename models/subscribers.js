var mongoose = require('mongoose'),
		Schema = mongoose.Schema,
		passportLocal = require('passport-local-mongoose');

var subscriber = new Schema({
	email: String
});

subscriber.plugin(passportLocal);

module.exports = mongoose.model('subscribers', subscriber);