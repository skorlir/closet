var item = require('./item.js')
	, _  = require('underscore')
	, Masters = require('../models/Item.js').ItemMasters;

exports.index = function(req, res) {
	console.log(req.params);
	var q = _.extend({}, { hobbies: req.params.hobby });

	Masters.find(q).exec(function(err, result) {
		console.log(err);
		console.log(result);

		res.render('hobby', { user: req.user, items: result });

	});
}