var mongoose = require('mongoose'),
		Schema = mongoose.Schema,
		passportLocal = require('passport-local-mongoose');

var subscriber = new Schema({
	email: String
});

module.exports = mongoose.model('subscribers', subscriber);