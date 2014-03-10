
/*
 * GET home page.
 */

var Items = require('../models/Item.js');

exports.index = function(req, res){
	if (req.isAuthenticated()) {
		Items.find().limit(10).exec(function(err, result) {
			if (err) console.log(err);
			res.render('dashboard', { user: req.user, items: result });
		});
	}
	else {
		res.render('index', {title: 'Closet'});
	}
};