var isLogin = require('../../policies/isLogin');
var friend = require('../../sharable/friend');
var mailer = require('../../util/mailer');
var message = require('../../sharable/message');
var uuid = require('node-uuid');

module.exports = {
  urls: ['/friend/add', '/friend/invite'],
  routers: {
    post: function (req, res) {
      var user = req.session.user;
      var extracted = req.extracted.body;
      var User = req.models.User;
      var MessageFriendInvite = req.models.MessageFriendInvite;
      var Friend = req.models.Friend;
      var token = String(uuid.v4());
      if (extracted.email === user.email) {
        return res.errorize(res.errors.FriendSelfAdditionNotAllowed);
      }
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
          return message.friend.invite.create(MessageFriendInvite, user, extracted.email, token);
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
    post: isLogin
  },
  validations: {
    post: {
      required: ['body'],
      body: {
        email: {
          type: 'email',
          required: true
        }
      }
    }
  }
};
