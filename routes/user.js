
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
	email: { type: String, trim: true }
});

var subscriber = mongoose.model('subscribers', subscriberSchema);

exports.list = function(req, res){
	res.send('list whut?');
	subscriber.find({}).exec(function (err, result) {
		if(!err) {
				res.render('userlist', result);
		} else { console.log('error: ' + err); }
	});
	
};

exports.add = function(req, res){
	
	res.send('hurajdkflaj');
};