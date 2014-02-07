/*
 * Dashboard route exports
 */

var Items = require('../models/Item.js');

exports.index = function(req, res){
	//produce user dashboard
	req.isAuthenticated() ? res.render('dashboard', { user: req.user }) : res.redirect('/login');
}

exports.getItemsQuery = function(req, res){
	if (req.isAuthenticated()) {
		var q = req.body.queryObject;
		
		Items.find(q).exec(function(result, err) {
			
		});
	
	}
}