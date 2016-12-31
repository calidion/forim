var isLogin = require('../../policies/isLogin');
var friend = require('../../sharable/friend');
var message = require('../../sharable/message');

module.exports = {
  urls: ['/friend/ack'],
  routers: {
    get: function (req, res) {
      var user = req.session.user;
      var extracted = req.extracted.query;
      var MessageFriendInvite = req.models.MessageFriendInvite;
      var MessageFriendAccept = req.models.MessageFriendAccept;
      var Friend = req.models.Friend;
      var options = {
        email: user.email
      };
      if (process.env.FORIM_INVITATION_IGNORE <= 0) {
        if (user.email !== extracted.email) {
          return res.redirect('/');
        }
      } else {
        options.email = extracted.email;
      }
      // 处理好友邀请请求
      message.friend.invite.process(MessageFriendInvite, options).then(function (processed) {
        if (!processed) {
          return res.errorize(res.errors.MessageNotFound);
        }
        var accepted = true;
        if (extracted.status === 'reject') {
          accepted = false;
        }
        return message.friend.accept.create(MessageFriendAccept
          , user.id, processed.user, accepted).then(function () {
            if (accepted) {
              return friend.create(Friend, user, processed.user).then(function (created) {
                return created;
              });
            }
          }).then(function (created) {
            return res.errorize(res.errors.Success, created);
          });
      }).fail(res.onError);
    }
  },
  policies: {
    all: isLogin
  },
  validations: {
    get: {
      query: {
        email: {
          type: 'email',
          required: true
        },
        token: {
          type: 'string',
          required: true
        },
        status: {
          type: 'enum',
          required: true,
          enums: ['accept', 'reject']
        }
      }
    }
  }
};
