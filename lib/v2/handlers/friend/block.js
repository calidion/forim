var isLogin = require('../../policies/isLogin');
var friend = require('../../sharable/friend');
var blocked = require('../../sharable/blocked');

module.exports = {
  urls: ['/friend/block'],
  routers: {
    post: function (req, res) {
      var user = req.session.user;
      var extracted = req.extracted.body;
      var User = req.models.User;
      var UserBlocked = req.models.UserBlocked;
      var Friend = req.models.Friend;
      User.findOne({
        id: extracted.id
      }).then(function (found) {
        if (!found) {
          return res.errorize(res.errors.UserNotFound);
        }
        return friend.remove(Friend, user, found)
          .then(function () {
            return blocked.create(UserBlocked, user, found);
          })
          .then(function () {
            return res.errorize(res.errors.Success);
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
