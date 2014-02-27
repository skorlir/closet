var   _  	= require('underscore')
	, Items = require('../models/Item.js')
	, Hobbies = require('../models/Hobby.js')
	, Account = require('../models/Account.js');

exports.index = function(req, res) {
	var hobbyQuery = req.params.hobby;
	var hobbyResult, itemsResult;
	
	Hobbies.findOne({ name: hobbyQuery }).exec().addBack(function(err, result) {
		if(err) console.log(err);
		return result;
	})
	.then( function(hobby) {
		hobbyResult = hobby;
		return Items.find({ hobbies: hobbyQuery }).exec();
	})
	.then(function(hobbyItems) {
		itemsResult = hobbyItems;
//			var stuff = hobbyResult.activity.map(function(el) { return el.userId });
//			console.log(stuff);
//			
//			Account.find({_id: { $in : stuff}}).exec(function (err, result) {
//				if(err) console.log(err);
//				console.log(result);
//			});

		var activity = hobbyResult.activity.concat(itemsResult);
		
		console.log(activity);

		activity.sort(function(i1, i2) {
			return i1.timeStamp - i2.timeStamp;
		});
		
		console.log(activity);
		
		return activity;
	})
	.then( function(activity) {
		res.render('hobby', { user: req.user, recentActivity: activity, hobby: hobbyResult });
	});
}
