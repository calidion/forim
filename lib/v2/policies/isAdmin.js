module.exports = function (req, res, next) {
  if (process.env.FORIM_BY_PASS_POLICIES > 0) {
    req.session.user = {
      is_admin: true
    };
  }
  var isAdmin = req.session &&
    req.session.user &&
    req.session.user.is_admin;
  if (!isAdmin) {
    res.status(403).send('Access Denied!');
    // return next(false);
    return;
  }
  return next(true);
};
