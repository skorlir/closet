var mongoose = require('mongoose')
		, Schema = mongoose.Schema;

var hobby = Schema({
	name: {type: String, index: { unique: true, dropDups: true } },
	// consider referencing users by uid instead
	members: [Schema.ObjectId],
	bannerPhoto: String,
	activity: [{ owner: Schema.ObjectId,
				 timestamp: Date,
			   	 tilePhoto: String,
				 description: String
			   }]
});

module.exports = mongoose.model('Hobby', hobby);