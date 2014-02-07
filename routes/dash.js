/*
 * Dashboard route exports
 */

exports.index = function(req, res){
	//produce user dashboard
	req.isAuthenticated() ? res.render('dashboard', { user: req.user }) : res.redirect('/login');
}