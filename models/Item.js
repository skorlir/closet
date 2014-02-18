var mongoose = require('mongoose')
		, Schema = mongoose.Schema;

var itemMaster = new Schema({
	//upc: 	{ type: Number, index: { unique: true, dropDups: true } },
	name: { type: String, trim: true, required: true },
	
	hobbies: [String],
	tags: [String],
	description: String,
	photos: [String],
	mainPhoto: String,
	marketValue: Number,
	siteValue: Number,
	count: { type: Number, default: 0 }
});

var Masters = mongoose.model('itemMasters', itemMaster);

var itemInstance = new Schema({
	master_id: { type: Schema.ObjectId, required: true },
	index: { type: Number, min: 1, required: true },
	name: String,
	condition: {
								description: String,
								rating: { type: Number, min: 0.0, max: 10.0 }
							},
	description: String
});

itemMaster.pre('save', function(next) {
	var item = this;
	Masters.findOne({name: item.name}, function(err, obj) {
		if(err) return next(err);
		if(obj) return next(new Error('master ref exists'));
	});
	next();
});

itemInstance.pre('save', function(next) {
	var item = this;
	var master = Masters.findOne({ _id: item.master_id }, function (err, obj) { 
		console.log(err); 
		return obj; 
	});
	
	if (!master) return next(new Error('No itemMaster of _id ' + item.master_id + ' found.'));
	
	item.index = master.count + 1;
	
	master.update({ count: master.count + 1 }, { upsert: false }, function (err) { 
		if (err) { 
			console.log(err); 
			return err; 
		}
	});
	next();
});

exports.ItemMasters = Masters;
exports.Items = mongoose.model('Item', itemInstance);
