var isLogin = require('../../policies/isLogin');

module.exports = {
  urls: ['/friend/add'],
  routers: {
    post: function (req, res) {
      var extracted = req.extracted.body;
      var User = req.models.User;
      User.findOne({
        email: extracted.email
      }).then(function () {
      }).fail(function () {
      });
    }
  },
  policies: {
    all: isLogin
  },
  validations: {
    post: {
      body: {
        email: {
          type: 'email',
          required: true
        }
      }
    }
  }
};
