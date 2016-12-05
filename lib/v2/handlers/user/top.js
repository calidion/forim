module.exports = {
  urls: ['/user/top', '/v2/user/top'],
  routers: {
    get: function (req, res) {
      var User = req.models.User;
      User.find({
        isBlocked: false,
        sort: 'score desc',
        limit: 100
      }).then(function (users) {
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
