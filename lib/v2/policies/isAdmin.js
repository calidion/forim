module.exports = function (req, next) {
  if (process.env.FORIM_BY_PASS_POLICIES > 0) {
    req.session.user = {
      is_admin: true
    };
  }
  var isAdmin = req.session &&
    req.session.user &&
    req.session.user.is_admin;
  if (!isAdmin) {
    return next(false);
  }
  return next(true);
};
