var mongoose = require('mongoose')
		, Schema = mongoose.Schema
		, passportLocalMongoose = require('passport-local-mongoose');

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