var isLogin = require('../../policies/isLogin');
var friend = require('../../sharable/friend');

module.exports = {
  urls: ['/friend/remove'],
  routers: {
    post: function (req, res) {
      var user = req.session.user;
      var extracted = req.extracted.body;
      var User = req.models.User;
      var Friend = req.models.Friend;
      User.findOne({
        id: extracted.id
      }).then(function (found) {
        if (!found) {
          return res.errorize(res.errors.UserNotFound);
        }
        return friend.isFriend(Friend, user, found).then(function (friendFound) {
          if (!friendFound) {
            return res.errorize(res.errors.FriendNotFound);
          }
          return Friend.destroy({
            id: friendFound.id
          }).then(function () {
            return res.errorize(res.errors.Success);
          }).fail(res.onError);
        }).fail(res.onError);
      }).fail(res.onError);
    }
  },
  policies: {
    post: isLogin
  },
  validations: {
    post: {
      body: {
        id: {
          type: 'string',
          required: true
        }
      }
    }
  }
};
