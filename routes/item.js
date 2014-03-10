/*
 * Routing for managing itemMasters database
 *  
 */

var Items = require('../models/Item.js');
var _ = require('underscore');
var Types = require('mongoose').Types;

exports.getItemsQuery = function(req, res){
	if (req.isAuthenticated()) {
		var q = _.extend({},req.body.query);
		
		console.log(q);
		
		Items.find(q).exec(function(err, result) {
			
			res.render('dashItem', { items: result });
			
		});
	
	}
}

exports.itemPage = function(req, res) {
	
	Items.findOne({ _id: req.params.id }).exec( function(err, result) {	
		result === null ? res.status('404').send('No such item! Whoops!') : res.render('itempage', { item: result, user: req.user });
	});
}

exports.demo = function(req, res) {
	Items.findOne({ name: 'Northface Backcountry Tent' }).exec( function(err, result) {
		result === null ? res.status('404').send('No demo for you darnit') : res.redirect('/items/'+result._id);
	});
}