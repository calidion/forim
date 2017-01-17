var isLogin = require('../../policies/isLogin');
var blocked = require('../../sharable/blocked');

module.exports = {
  urls: ['/friend/unblock'],
  routers: {
    post: function (req, res) {
      var user = req.session.user;
      var extracted = req.extracted.body;
      var User = req.models.User;
      var UserBlocked = req.models.UserBlocked;
      User.findOne({
        id: extracted.id
      }).then(function (found) {
        if (!found) {
          return res.errorize(res.errors.UserNotFound);
        }
        UserBlocked.findOne({
          user: user.id,
          blocked: extracted.id
        }).then(function (userBlocked) {
          if (userBlocked) {
            return blocked.remove(UserBlocked, user, found)
              .then(function () {
                return res.errorize(res.errors.Success);
              }).fail(res.onError);
          }
          return res.errorize(res.errors.BlockedUserNotFound);
        }).fail(res.onError);
      }).fail(res.onError);
    }
  },
  policies: {
    post: isLogin
  },
  validations: {
    post: {
      required: ['body'],
      body: {
        id: {
          type: 'string',
          required: true
        }
      }
    }
  }
};
