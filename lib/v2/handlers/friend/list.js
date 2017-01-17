var isLogin = require('../../policies/isLogin');
module.exports = {
  urls: ['/friend/list'],
  routers: {
    get: function (req, res) {
      var user = req.session.user;
      var Friend = req.models.Friend;
      var options = {
        user: user.id
      };
      Friend.find(options).populate('user').populate('friend').then(function (friends) {
        res.errorize(res.errors.Success,
          friends);
      }).fail(res.onError);
    }
  },
  policies: {
    get: isLogin
  }
};
