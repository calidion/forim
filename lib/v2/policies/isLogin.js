module.exports = function (req, next) {
  if (process.env.FORIM_BY_PASS_POLICIES > 0) {
    req.session.user = {
      id: '1'
    };
  }
  var isUser = req.session &&
    req.session.user;
  if (!isUser) {
    return next(false);
  }
  return next(true);
};
