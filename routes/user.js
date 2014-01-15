
/*
 * GET users listing.
 */

var mongoose = require('mongoose');
var _ = require('underscore');
	
var uristring =
process.env.MONGOLAB_URI ||
process.env.MONGOHQ_URL ||
'mongodb://localhost/HelloMongoose';
	
mongoose.connect(uristring, function (err, res) {
if (err) {
	console.log ('ERROR connecting to: ' + uristring + '. ' + err);
} else {
	console.log ('Succeeded connected to: ' + uristring);
}
});

var subscriberSchema = new mongoose.Schema({
	email: String
});

var subscriber = mongoose.model('subscribers', subscriberSchema);

exports.list = function(req, res){
	subscriber.find({}).exec(function (err, result) {
		if(!err) {
				//console.log(result);
				var p = [];
				_.each(result, function(el, dex) {
					el.email === undefined ? null : p.push(el.email);
				});
				console.log(p);
				res.render('userlist', { pinion: p });
		} else { console.log('error: ' + err); }
	});
	
};

exports.add = function(req, res){
	
	var newSub = new subscriber({ email: req.body.email });
	var err = false;
	console.log(newSub);
	newSub.save(function(err){ err=true; });
	
	res.send({isError: err, txt: 'Thanks! We\'ll be in touch.'});
};