var password = require('../../util/password');

function onFailure(err, req, res) {
  // res.status(422);
  res.render('notify/notify', {
    error: err
  });
}

module.exports = {
  urls: ['/password/update', '/v2/password/update'],
  routers: {
    post: function (req, res) {
      var extracted = req.extracted.body;
      var User = req.models.User;
      var user = req.session.user;
      var query = {
        username: user.username
      };
      User.findOne(query).then(function (found) {
        if (!found) {
          return onFailure('用户未找到!', req, res);
        }
        if (!password.compare(extracted.old, found.salt, found.password)) {
          return onFailure('旧密码不正确!', req, res);
        }
        found.password = password.create(extracted.new, found.salt);
        found.save(function (err) {
          if (err) {
            return onFailure(err, req, res);
          }
          return res.render('notify/notify', {
            success: '你的密码修改成功。'
          });
        });
      }).fail(function (err) {
        onFailure(err, req, res);
      });

    }
  },
  validations: {
    post: {
      body: {
        old: {
          type: 'string',
          required: true
        },
        new: {
          type: 'string',
          required: true
        },
        confirm: {
          matches: 'new'
        }
      }
    }
  },
  faulures: {
    validation: function (data, req, res) {
      onFailure('输入不正确!', req, res);
    }
  }
};
