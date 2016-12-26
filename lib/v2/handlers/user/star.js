function onFailure(err, req, res) {
  res.showPage('notify/notify', {
    error: err
  });
}
var isAdmin = require('../../policies/isAdmin');

module.exports = {
  urls: ['/user/star'],
  routers: {
    get: function (req, res) {
      var User = req.models.User;
      User.find({
        starred: true,
        blocked: false
      }).then(function (stars) {
        res.showPage('user/stars', {
          stars: stars
        });
      }).fail(function (e) {
        console.err(e);
      });
    },
    post: function (req, res) {
      var extracted = req.extracted.body;
      var User = req.models.User;
      User.findOne({
        username: extracted.username
      }).then(function (found) {
        if (!found) {
          return onFailure('用户未找到!', req, res);
        }
        found.starred = !found.starred;
        found.save(function (error) {
          if (error) {
            return onFailure('数据库错误!', req, res);
          }
          res.json({
            status: 'success',
            starred: found.starred
          });
        });
      }).fail(function () {
        return onFailure('数据库错误!', req, res);
      });
    }
  },
  policies: {
    post: isAdmin
  },
  validations: {
    post: {
      body: {
        username: {
          type: 'string',
          required: true
        }
      }
    }
  },
  failures: {
    validation: function (data, req, res) {
      onFailure('输入错误!', req, res, req.body);
    }
  }
};
