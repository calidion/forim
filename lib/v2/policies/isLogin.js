module.exports = function (req, res, next) {
  if (process.env.FORIM_BY_PASS_POLICIES > 0) {
    if (process.env.FORIM_MOCK_USER > 0) {
      req.session.user = {
        id: '1'
      };
    }
    return next(true);
  }
  var isUser = req.session &&
    req.session.user;
  if (!isUser) {
    return next(false);
  }
  return next(true);
};
