/*
 * Routing for managing itemMasters database
 *  
 */

var Masters = require('../models/Item.js').ItemMasters;
var Items = require('../models/Item.js').Items;
var _ = require('underscore');
var Types = require('mongoose').Types;

exports.getItemsQuery = function(req, res){
	if (req.isAuthenticated()) {
		var q = _.extend({},req.body.query);
		
		console.log(q);
		
		Masters.find(q).exec(function(err, result) {
			
			res.render('dashItem', { items: result });
			
		});
	
	}
}

exports.itemPage = function(req, res) {
	
	Masters.findOne({ _id: Types.ObjectId(req.params.id) }).exec( function(err, result) {		
		res.render('itempage', { item: result, user: req.user });
	});
}