var mongoose = require('mongoose'),
		Schema = mongoose.Schema,
		bcrypt = require('bcrypt-nodejs'),
		passportLocalMongoose = require('passport-local-mongoose'),
		SALT_WORK_FACTOR = 10;

var Account = Schema({
	username: { type: String, required: true, index: { unique: true } },
	password: { type: String, required: true },
	realName: { firstName: String,
						  lastName: String },
	email: String,
	location: String,
	communities: [String],
	itemMasterRefs: [{master_id: Number, instances: [{}]}]
});

Account.plugin(passportLocalMongoose);

Account.pre('save', function(next) {
	var user = this; //where this refers to the object that called save
	
	bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
		if (err) return next(err);
		
		bcrypt.hash(user.password, salt, function(err, hash) {
			if(err) return next(err);
			
			user.password = hash;
			next();
		});
	});
});

Account.methods.comparePassword = function(candidatePw, cb) {
	bcrypt.compare(candidatePw, this.password, function(err, isMatch) {
		if (err) return cb(err);
		cb(null, isMatch);
	});
}

module.exports = mongoose.model('User', Account);