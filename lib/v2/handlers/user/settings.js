var password = require('../../util/password');
var mailer = require('../../util/mailer');

// function onFailure(err, req, res) {
//   res.status(422);
//   res.render('sign/signin', {
//     error: err
//   });
// }

module.exports = {
  urls: ['/setting', '/v2/user/settings'],
  routers: {
    get: function (req, res) {
      var user = req.session.user;
      if (req.query.save === 'success') {
        user.success = '保存成功。';
      }
      return res.render('user/setting', user);
    },
    post: function (req, res) {
      var User = req.models.User;
      var user = req.session.user;
      var extracted = req.extracted;

      function showMessage(msg, data, isSuccess) {
        if (isSuccess) {
          data.success = msg;
        } else {
          data.error = msg;
        }
        res.render('user/setting', data);
      }
      switch (extracted.action) {
        case 'change_setting':

          User.update({
            id: user.id
          }, extracted).then(function (updated) {
            req.session.user = updated;
            return res.redirect('/setting?save=success');
          }).fail(function (err) {
            console.error(err);
          });
          break;
        case 'change_password':
          if (!extracted.oldPassword || !extracted.newPassword) {
            return res.send('旧密码或新密码不得为空!');
          }
          if (!password.compare(extracted.oldPassword, user.salt, user.password)) {
            return showMessage('当前密码不正确。', user);
          }
          User.update({
            id: user.id
          }, {
            password: password.create(extracted.newPassword, salt)
          }).then(function (updated) {
            req.session.user = updated;
            return showMessage('密码已被修改。', user, true);
          }).fail(function (err) {
            console.error(err);
          });
          break;
      }
    }
  },
  policies: {
    all: function (req, res, next) {
      if (!req.session || !req.session.user) {
        return res.status(403).send('Forbidden!');
      }
      next(true);
    }
  },
  validations: {
    post: {
      action: {
        type: 'string'
      },
      email: {
        type: 'email'
      },
      username: {
        type: 'string'
      },
      url: {
        type: 'url'
      },
      location: {
        type: 'string'
      },
      weibo: {
        type: 'string'
      },
      signature: {
        type: 'string'
      },
      accessToken: {
        type: 'string'
      },
      oldPassword: {
        type: 'string'
      },
      newPassword: {
        type: 'string'
      }
    }
  }
};
