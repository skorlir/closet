
/*
 * GET users listing.
 */

var mongoose = require('mongoose');
	
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
				console.log(result);
				console.log(JSON.stringify(result, undefined, 0));
				res.write(JSON.stringify(result, undefined, 0));
		} else { console.log('error: ' + err); }
	});
	
	res.write('list whut?');
	res.end();
	
};

exports.add = function(req, res){
	
	var newSub = new subscriber({ email: req.body.email });
	var err = false;
	console.log(newSub);
	newSub.save(function(err){ err=true; });
	
	res.send('shanks; err? '+err);
};