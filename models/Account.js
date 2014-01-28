var mongoose = require('mongoose')
		, Schema = mongoose.Schema
		, bcrypt = require('bcrypt-nodejs')
		, passportLocalMongoose = require('passport-local-mongoose')
		, SALT_WORK_FACTOR = 10;

var account = Schema({
	realName: { 
							firstName: String,
						  lastName: String 
						},
	location: { type: String, default: 'unknown'},
	communities: [String],
	itemMasterRefs: [{ master_id: Schema.ObjectId, instances: [] }]
});

account.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', account);