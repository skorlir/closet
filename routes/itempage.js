exports.index = function(req, res){
	//produces item page
	req.isAuthenticated() ? res.render('itempage', { user: req.user }) : res.redirect('/login');
}