function onFailure(err, req, res) {
  res.render('notify/notify', {
    error: err
  });
}
var isAdmin = require('../../policies/isAdmin');

module.exports = {
  urls: ['/user/star', '/v2/user/star'],
  routers: {
    get: function (req, res) {
      var User = req.models.User;
      User.find({
        isStar: true,
        isBlocked: false
      }).then(function (stars) {
        res.render('user/stars', {
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
        found.isStar = !found.isStar;
        found.save(function (error) {
          if (error) {
            return onFailure('数据库错误!', req, res);
          }
          res.json({
            status: 'success',
            isStar: found.isStar
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
