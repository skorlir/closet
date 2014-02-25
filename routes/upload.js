exports.index = function(req, res){
  req.isAuthenticated() ? res.render('upload', { user: req.user }) : res.render('index');
};