var mongoose = require('mongoose')
		, Schema = mongoose.Schema;

var hobby = Schema({
	name: String,
	members: [{ name: String, uid: Schema.ObjectId }],
	communities: [String],
	itemMasterRefs: [{ master_id: Schema.ObjectId }]
});

module.exports = mongoose.model('Hobby', hobby);