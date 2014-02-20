/*
 * Routing for managing itemMasters database
 *  
 */

var Masters = require('../models/Item.js').ItemMasters;
var Items = require('../models/Item.js').Items;
var _ = require('underscore');

exports.getItemsQuery = function(req, res){
	if (req.isAuthenticated()) {
		var q = _.extend({},req.body.query);
		
		console.log(q);
		
		Masters.find(q).exec(function(err, result) {
			
			console.log(result);
			
			res.render('dashItem', { items: result });
			
		});
	
	}
}

exports.itemPage = function(req, res) {
	Masters.find({ _id: req.params[0] }).exec( function(err, result) {
		if(err) console.log(err);
		if(result) console.log(result);
		
		res.render('itempage', { item: result, user: req.user });
	});
}