var mongoose = require('mongoose')
		, Schema = mongoose.Schema
		, passportLocalMongoose = require('passport-local-mongoose');

var account = Schema({
	realName: { 
							firstName: String,
						  lastName: String 
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
	friends: [{ username: String, profileURL: String, profilePicture: String }]
});

account.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', account);