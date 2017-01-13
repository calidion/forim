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
        email: extracted.email,
        token: extracted.token
      };
      if (user.email !== extracted.email) {
        return res.errorize(res.errors.EmailNotMatch);
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
              return Promise.all([
                friend.create(Friend, user, processed.user),
                friend.create(Friend, processed.user, user)
              ]);
            }
          }).then(function (created) {
            if (created) {
              created = created[0];
            }
            return res.errorize(res.errors.Success, created);
          });
      }).fail(res.onError);
    }
  },
  failures: {
    policy: function (err, req, res) {
      console.error(err);
      req.session.url = req.url;
      res.redirect('/oauth/github');
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
