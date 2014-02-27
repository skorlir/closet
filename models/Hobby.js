var mongoose = require('mongoose')
		, Schema = mongoose.Schema;

var hobby = Schema({
	name: String,
	// consider referencing users by uid instead
	members: [Schema.ObjectId],
	bannerPhoto: String,
	activity: [{ userId: Schema.ObjectId,
				 timestamp: Number,
			   	 photoContent: String,
				 textContent: String
			   }]
});

module.exports = mongoose.model('Hobby', hobby);