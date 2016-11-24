var allPolicies = {
  admin: require('./isAdmin'),
  user: require('./isUser'),
  login: require('./isLogin')
};

module.exports = function (req, res, next) {
  req._isPermitted = function (name, cb, rescue) {
    var policy = allPolicies[name];
    if (typeof policy === 'function') {
      return policy(req, res, function (permitted) {
        if (permitted) {
          cb();
        } else if (typeof rescue === 'function') {
          rescue();
        } else {
          res._accessDenied();
        }
      });
    }
    res._accessDenied();
  };
  next();
};
