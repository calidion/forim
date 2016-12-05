function onFailure(err, req, res) {
  res.showPage('notify/notify', {
    error: err
  });
}

module.exports = {
  urls: ['/active_account', '/user/activate', '/v2/user/activate'],
  routers: {
    get: function (req, res) {
      var extracted = req.extracted.query;
      var User = req.models.User;
      User.findOne({
        username: extracted.username
      }).then(function (found) {
        if (!found) {
          return onFailure('用户未找到!', req, res);
        }
        if (found.accessToken !== extracted.token) {
          return onFailure('Token不正确!', req, res);
        }
        if (found.active) {
          return res.showPage('notify/notify', {
            success: '帐号已经激活!'
          });
        }
        found.active = true;
        found.save(function (error) {
          if (error) {
            return onFailure('数据库错误!', req, res);
          }
          res.showPage('notify/notify', {
            success: '帐号激活成功，你可以现在登录论坛了!'
          });
        });
      }).fail(function () {
        return onFailure('数据库错误!', req, res);
      });
    }
  },
  validations: {
    get: {
      query: {
        username: {
          type: 'string',
          required: true
        },
        token: {
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
