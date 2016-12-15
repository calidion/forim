var isLogin = require('../../policies/isLogin');
module.exports = {
  urls: [
    '/user/profile'
  ],
  routers: {
    get: function (req, res) {
      var user = req.session.user;
      res.errorize(res.errors.Success, user);
    }
  },
  policies: {
    get: isLogin
  },
  failures: {
    policy: function (error, req, res) {
      res.errorize(res.errors.Failure, error);
    }
  }
};
