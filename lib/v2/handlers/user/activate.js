function onFailure(err, req, res) {
  res.render('notify/notify', {
    error: err
  });
}

module.exports = {
  urls: ['/active_account', '/v2/user/activate'],
  routers: {
    get: function (req, res) {
      var extracted = req.extracted;
      var User = req.models.User;
      User.findOne({
        username: extracted.username
      }).then(function (found) {
        console.log('found');
        if (!found) {
          console.log('found 1');

          return onFailure('用户未找到!', req, res);
        }
        if (found.accessToken !== extracted.token) {
          console.log('found 2');
          return onFailure('Token不正确!', req, res);
        }
        if (found.active) {
          console.log('found 3');
          return onFailure('帐号已经激活!', req, res);
        }
        found.active = true;
        found.save(function (error) {
          if (error) {
            console.log('found 4');
            return onFailure('数据库错误!', req, res);
          }
          console.log('found 5');
          onFailure('帐号激活成功，你可以现在登录论坛了!', req, res);
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
