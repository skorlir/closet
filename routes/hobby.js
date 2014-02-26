var _  = require('underscore')
	, Item = require('../models/Item.js');

exports.index = function(req, res) {
	console.log(req.params);
	var q = _.extend({}, { hobbies: req.params.hobby });

	Item.find(q).exec(function(err, result) {
		console.log(err);
		console.log(result);

		res.render('hobby', { user: req.user, items: result });

	});
}