var isLogin = require('../../policies/isLogin');
var friend = require('../../sharable/friend');

module.exports = {
  urls: ['/friend/ack'],
  routers: {
    get: function (req, res) {
      var user = req.session.user;
      var extracted = req.extracted.query;
      var MessageFriend = req.models.MessageFriend;
      var Friend = req.models.Friend;

      if (!process.env.FORIM_INVITATION_IGNORE) {
        if (user.email !== extracted.email) {
          return res.redirect('/');
        }
      }

      MessageFriend.findOne(extracted).populate('user').then(function (found) {
        if (!found) {
          return res.errorize(res.errors.MessageNotFound);
        }
        if (found.processed) {
          return res.errorize(res.errors.MessageProcessed);
        }
        return friend.create(Friend, found.user, user).then(function (created) {
          if (!created) {
            throw req.errors.UserNotCreated;
          }
          return MessageFriend.update({
            id: found.id
          },
            {
              processed: true
            });
        }).then(function () {
          return res.errorize(res.errors.Success);
        }).fail(res.onError);
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
        }
      }
    }
  }
};
