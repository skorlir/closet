
/*
 * GET home page.
 */

var Items = require('../models/Item.js');
var fs = require('fs');
var path = require('path');
var crypto = require('crypto');

var AWS_ACCESS_KEY = process.env.OUTROVERT_AWS_ACCESS_KEY_ID || 'AKIAIL4CN36DNKF2J6MQ';
var AWS_SECRET_KEY = process.env.OUTROVERT_AWS_SECRET_ACCESS_KEY || '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';
var S3_BUCKET	   = process.env.S3_BUCKET_NAME || 'outrovert-uploads';

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

exports.aws0signature = function(req, res) {
	var object_name = req.query.s3_object_name;
	var mime_type = req.query.s3_object_type;

	var now = new Date();
	var expires = Math.ceil((now.getTime() + 10000)/1000); // 90 seconds from now
	var amz_headers = "x-amz-acl:public-read";

	//MUST encode ONLY the filename in object_name (AKA encode the spaces, apparently, but not the rest???)
	var put_request = "PUT\n\n"+mime_type+"\n"+expires+"\n"+amz_headers+"\n/"+S3_BUCKET+"/"+object_name.split('_')[0] + '_' + encodeURIComponent(object_name.split('_')[1]);
	
	console.log(put_request);

	var signature = crypto.createHmac('sha1', AWS_SECRET_KEY).update(put_request).digest('base64');
	signature = encodeURIComponent(signature.trim());
	//AWS musta fixed + encoding problems; this breaks
	//signature = signature.replace(/%2B/g,'+');
	//signature = signature.replace('%3D','=');
	
	console.log(signature);

	var url = 'https://'+S3_BUCKET+'.s3.amazonaws.com/'+object_name;

	var credentials = {
		signed_request: url+"?AWSAccessKeyId="+AWS_ACCESS_KEY+"&Expires="+expires+"&Signature="+signature,
		url: url
	};
	res.write(JSON.stringify(credentials));
	res.end();
};
