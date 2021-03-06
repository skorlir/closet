
/*
 * GET home page.
 */

var fs = require('fs');
var path = require('path');
var crypto = require('crypto');
var nodemailer = require('nodemailer');
var stripe     = require('stripe')("sk_test_XZ4cLrAvVlvAoUTWDsdXnqOi");

var AWS_ACCESS_KEY = process.env.OUTROVERT_AWS_ACCESS_KEY_ID || 'AKIAIL4CN36DNKF2J6MQ';
var AWS_SECRET_KEY = process.env.OUTROVERT_AWS_SECRET_ACCESS_KEY || '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';
var S3_BUCKET	   = process.env.S3_BUCKET_NAME || 'outrovert-uploads';

var smtpTransport = nodemailer.createTransport("SMTP", {
	service: 'Mandrill',
	auth: {
		user: 'skorlir@gmail.com',
		pass: 'BIT8tELthNj7CAObeJ_M4Q'
	}
});

var toOutrovert = "User ### has opened a transaction on Outrovert (var dump): %%%";

var toUser      = "<p>Hi ###,<br><p>Thank you for using Outrovert's marketplace!<br><p>Your transaction on %%% has been opened, and we'll update you as soon as the seller has accepted the offer with further details.<br><br><p>If you have any questions, please feel free to reply to this email or chat with us in the Olark window on outrovert.co! <br><p>Thanks!<p>The Outrovert Team";

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

	//MUST encode ONLY the filename in object_name
	var put_request = "PUT\n\n"+mime_type+"\n"+expires+"\n"+amz_headers+"\n/"+S3_BUCKET+"/"+object_name.split('_')[0] + encodeURIComponent(object_name.slice(object_name.indexOf('_')));
	
	console.log(put_request);

	var signature = generateSignature(put_request);

	var url = 'https://'+S3_BUCKET+'.s3.amazonaws.com/'+object_name;

	var credentials = {
		signed_request: url+"?AWSAccessKeyId="+AWS_ACCESS_KEY+"&Expires="+expires+"&Signature="+signature,
		url: url
	};
	res.write(JSON.stringify(credentials));
	res.end();
};

exports.commitTransaction = function(req, res) { 
	//FIXME: Add purchaser email to email to outrovert team
	var user = req.body.user;
	delete user.connections;
	var r = req.body.r;
	
	var outmsg = toOutrovert.split('###').join(JSON.stringify(user));
	outmsg  = outmsg.split('%%%').join(JSON.stringify(r));
	
	var usrmsg = toUser.split('###').join(user.displayName);
	usrmsg  = usrmsg.split('%%%').join(r.item.name + ' for $' + r.item.price);
	
	var userConf = {to: user.email, from: 'The Outrovert Team <nuventioncloset@gmail.com>', subject: 'Your Transaction has been Received and is in Processing!', html: usrmsg};
	
	var newmsg = {to: 'nuventioncloset@gmail.com', from: 'AUTOMATED TRANSACTION MSG <dne@outrovert.co>', subject: "TRANSACTION COMMITTED", html: outmsg};
	smtpTransport.sendMail(newmsg, function(error, resp) {
		if(error) console.log(error);
		else console.log(user.displayName + " TRANSACTION COMMIT SUCCESS");
	});
	smtpTransport.sendMail(userConf, function(error, resp) {
		if(error) console.log(error);
		else console.log("sent transaction conf to " + user.displayName);
	});
};

exports.nonfeature = function(req, res) {
	var feature = req.body.data;
	
	var msg = {
		to: 'nuventioncloset@gmail.com',
		from: 'non feature reporter <fdne@outrovert.co>',
		subject: 'someone tried to use a non feature: ' + feature,
		html: 'non feature ' + feature
	};
	
	smtpTransport.sendMail(msg, function(error, resp) {
		if(error) console.log(error);
		else console.log(resp);
	});
};

function generateSignature(put_request) {
	var signature = crypto.createHmac('sha1', AWS_SECRET_KEY).update(put_request).digest('base64');
	signature = encodeURIComponent(signature.trim());
	//AWS musta fixed + encoding problems; this breaks
	//signature = signature.replace(/[+]/g,'+');
	//signature = signature.replace('%3D','=');
	//EDIT: No they didn't but their uploader was broken
	return signature;
}

exports.stripeCall = function(req, res) {
  //          stripeToken: token,
  //        item: r.item,
  //        seller: r.poster,
  //        purchaser: $scope.user
  var stripeToken = req.body.stripeToken;
  var customerId  = req.body.purchaser.stripeCustomerId;
  console.log(stripeToken);
  console.log(customerId);
  
  if(customerId) {
    setTimeout(function() {
      stripe.charges.create({
        amount: req.body.item.price,
        currency: "usd",
        customer: customerId
      });
    }, 3*24*60*60);
    console.log(customerId);
    res.send(customerId);
  }
  else {
    stripe.customers.create({
      card: stripeToken.id,
      description: req.body.purchaser.email
    }).then(function(customer) { 
      console.log("got there...");
      setTimeout(function() {
        stripe.charges.create({
          amount: req.body.item.price,
          currency: "usd",
          customer: customer.id
        });
      }, 3*24*60*60);
      console.log(customer.id);
      res.send(customer.id);
    }, function(err) {
      console.log(err);
    });
  }
}

exports.verifyEmail= function(req, res) {
  var user  = req.body.user;
  var email = req.body.email;
  
  var token;
  
  crypto.randomBytes(48, function(ex, buf) {
    token = buf.toString('hex');
  });
  
  smtpTransport.sendMail({
    to: email,
    from: 'Outrovert EMAIL VERIFICATION <dne+email-verifier@outrovert.co>',
    subject: 'Confirm Email Add',
    html: 
      '<h2>Hello ' + user.displayName + ', </h2> ' +
      '<br>' +
      '<p>You recently added this email address (' + email + ') to your Outrovert account. If the name above does not belong to you or you believe this to be in error, please ignore this message. </p>' +
      '<p>Click <a href="outrovert.co/confirmEmail?token=' + token + '">here</a> to confirm your email, after which you should be able to access everything Outrovert has to offer.</p>' +
      '<br><p>Thanks!</p><br><br><p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;The Outrovert Team</p>'
  }, function(error, resp) {
    if(error) console.log(error);
    else console.log("Sent email verification code to " + user.displayName + " for email " + email);
  });
  
  res.send({token: token});
}
