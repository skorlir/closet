var mongoose = require('mongoose')
		, Schema = mongoose.Schema
		, passportLocalMongoose = require('passport-local-mongoose');

var account = Schema({
	name: { 
				first: String,
				last: String 
				},
	location: { type: String, default: 'unknown'},
	age: Number,
	hobbies: [String],
	communities: [String],
	profilePicture: String,
	bannerPicture: String,
	profileURL: String,
	//TODO: denormalize item schema
	myCollection: [Schema.mixed],
	favorites: [Schema.mixed],
	friends: [Schema.ObjectId],
	isAdmin: { type: Boolean, default: false }
});

account.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', account);