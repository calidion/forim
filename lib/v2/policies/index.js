var allPolicies = {
  admin: require('./isAdmin'),
  user: require('./isUser'),
  login: require('./isLogin')
};

module.exports = function (req, res, next) {
  function accessDenied() {
    res.status(403);
    res.type('txt').send('Permission Denied!');
  }
  req._isPermitted = function (name, cb) {
    var policy = allPolicies[name];
    if (typeof policy === 'function') {
      return policy(req, function (permitted) {
        if (permitted) {
          cb();
        } else {
          accessDenied();
        }
      });
    }
    accessDenied();
  };
  next();
};
