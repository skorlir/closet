var   _  	= require('underscore')
	, Items = require('../models/Item.js')
	, Hobbies = require('../models/Hobby.js')
	, Account = require('../models/Account.js');

exports.index = function(req, res) {
	var hobbyQuery = req.params.hobby;
	var hobbyResult, itemsResult;
	
	Hobbies.findOne({ name: hobbyQuery }).exec(function(err, result) {
		if(err) console.log(err);
		hobbyResult = result;

		Items.find({ hobbies: hobbyQuery }).exec(function(err, result) {
			if(err) console.log(err);
			itemsResult = result;
//			var stuff = hobbyResult.activity.map(function(el) { return el.userId });
//			console.log(stuff);
//			
//			Account.find({_id: { $in : stuff}}).exec(function (err, result) {
//				if(err) console.log(err);
//				console.log(result);
//			});

			var activity = hobbyResult.activity.concat(itemsResult);

			activity.sort(function(i1, i2) {
				return i1.timeStamp - i2.timeStamp;
			});

			res.render('hobby', { user: req.user, recentActivity: activity, hobby: hobbyResult });
		});
	});
}
