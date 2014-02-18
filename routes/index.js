
/*
 * GET home page.
 */

exports.index = function(req, res){
  req.isAuthenticated() ? res.render('dashboard', { user: req.user }) : res.redirect('/');
};