
/*
 * GET home page.
 */

var Items = require('../models/Item.js');
var fs = require('fs');
var path = require('path');

exports.index = function(req, res) {
	res.render('index');
};

exports.test = function(req, res) {
	res.render('test');
};

exports.upload = function(req, res) {
	console.log(req);
	var name = req.files.file.path.split('\\').slice(-1);
	var newPath = path.join(__dirname, '../public/uploads/' + name);
	console.log(newPath);
	fs.rename(req.files.file.path, newPath, function(err) {
		if(err) console.log(err), res.send(err);
		else res.send(name);
	});
};
