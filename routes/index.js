
/*
 * GET home page.
 */

var Items = require('../models/Item.js');

exports.index = function(req, res) {
	res.render('index');
};

exports.test = function(req, res) {
	res.render('test');
};