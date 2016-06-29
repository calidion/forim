module.exports = function (req, res, next) {
  var isAdmin = req.session &&
  req.session.user &&
  req.session.user.is_admin;
  if (!isAdmin && process.env.FORIM_BY_PASS_POLICIES <= 0) {
    res.status(404);
    res.type('txt').send('Not found!');
    return;
  }
  return next();
};
