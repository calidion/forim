function onFailure(err, req, res) {
  res.render('notify/notify', {
    error: err
  });
}

module.exports = {
  urls: ['/user/block', '/v2/user/block'],
  routers: {
    post: function (req, res) {
      var extracted = req.extracted.body;
      var User = req.models.User;
      User.findOne({
        username: extracted.username
      }).then(function (found) {
        if (!found) {
          return onFailure('用户未找到!', req, res);
        }
        found.isBlocked = !found.isBlocked;
        found.save(function (error) {
          if (error) {
            return onFailure('数据库错误!', req, res);
          }
          res.json({
            status: 'success',
            isBlocked: found.isBlocked
          });
        });
      }).fail(function () {
        return onFailure('数据库错误!', req, res);
      });
    }
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
