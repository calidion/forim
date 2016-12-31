var isLogin = require('../../policies/isLogin');
var friend = require('../../sharable/friend');
var mailer = require('../../util/mailer');
var message = require('../../sharable/message');
var uuid = require('node-uuid');

module.exports = {
  urls: ['/friend/add'],
  routers: {
    post: function (req, res) {
      var user = req.session.user;
      var extracted = req.extracted.body;
      var User = req.models.User;
      var MessageFriend = req.models.MessageFriend;
      var Friend = req.models.Friend;
      var token = String(uuid.v4());

      User.findOne({
        email: extracted.email
      }).then(function (found) {
        if (found) {
          return friend.isFriend(Friend, user, found).then(function (isFriend) {
            if (isFriend) {
              return false;
            }
            return true;
          });
        }
        return true;
      }).then(function (notFriend) {
        if (notFriend) {
          return message.friend(MessageFriend, user, extracted.email, token);
        }
        return false;
      }).then(function (message) {
        if (!message) {
          return res.errorize(res.errors.FriendExists);
        }
        return new Promise(function (resolve) {
          mailer.friend.add(extracted.email, user, token, resolve);
        }).then(function () {
          return res.errorize(res.errors.Success, {
            token: message.token,
            email: message.email
          });
        });
      }).fail(res.onError);
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
