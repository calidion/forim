var isLogin = require('../../policies/isLogin');
var friend = require('../../sharable/friend');

module.exports = {
  urls: ['/friend/ack'],
  routers: {
    get: function (req, res) {
      var user = req.session.user;
      var extracted = req.extracted.body;
      var User = req.models.User;
      var Message = req.models.Message;
      var MessageFriend = req.models.MessageFriend;
      var Friend = req.models.Friend;

      User.findOne({
        email: extracted.email
      }).then(function (found) {
        console.log(found);
        if (found) {
          return friend.isFriend(Friend, user, found).then(function (isFriend) {
            if (isFriend) {
              return false;
            }
            return true
          });
        }
        return true;
      }).then(function (notFriend) {
        if (notFriend) {
          return MessageFriend.create({
            user: user.id,
            email: extracted.email
          });
        }
        return false;
      }).then(function (message) {
        if (!message) {
          return res.errorize(res.errors.FriendExists);
        }
        return res.errorize(res.errors.Success);
      }).fail(function (err) {
        console.error(err);
      });
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
        token : {
          type: 'string',
          required: true
        }
      }
    }
  }
};
