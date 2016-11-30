var admins = require('../../config').admins;
module.exports = function (req, res, next) {
  if (process.env.FORIM_BY_PASS_POLICIES > 0) {
    req.session.user = {
      isAdmin: true
    };
    return next(true);
  }
  if (!req.session.user) {
    return next(false);
  }

  admins = admins.split(',');
  if (admins.indexOf(req.session.user.username) === -1) {
    next(false);
  } else {
    next(true);
  }
};
