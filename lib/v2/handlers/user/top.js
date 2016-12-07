var sharable = require('../../sharable');
module.exports = {
  urls: ['/user/top', '/v2/user/top'],
  routers: {
    get: function (req, res) {
      var User = req.models.User;
      sharable.user.highest100(User).then(function (users) {
        res.showPage('user/top100', {
          users: users,
          pageTitle: '排名前100的用户!'
        });
      }).fail(function () {
        res.showPage('notify/notify', {
          error: '出错了，请稍候再试!'
        });
      });
    }
  }
};
