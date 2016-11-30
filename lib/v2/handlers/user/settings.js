var password = require('../../util/password');

module.exports = {
  urls: ['/user/settings', '/v2/user/settings'],
  routers: {
    get: function (req, res) {
      var user = req.session.user;
      console.log('inside get');
      if (req.query.save === 'success') {
        user.success = '保存成功。';
      }
      return res.render('user/settings', user);
    },
    post: function (req, res) {
      var User = req.models.User;
      var user = req.session.user;
      var extracted = req.extracted.body;

      // function showMessage(msg, data, isSuccess) {
      //   if (isSuccess) {
      //     data.success = msg;
      //   } else {
      //     data.error = msg;
      //   }
      //   res.render('user/settings', data);
      // }
      User.update({
        id: user.id
      }, extracted).then(function (updated) {
        console.log(updated);
        req.session.user = updated[0];
        return res.redirect('/user/settings?save=success');
      }).fail(function (err) {
        console.error(err);
      });
      //   break;
      // case 'change_password':
      //   if (!extracted.oldPassword || !extracted.newPassword) {
      //     return res.send('旧密码或新密码不得为空!');
      //   }
      //   if (!password.compare(extracted.oldPassword, user.salt, user.password)) {
      //     return showMessage('当前密码不正确。', user);
      //   }
      //   User.update(
      //     {
      //       id: user.id
      //     }, {
      //       password: password.create(extracted.newPassword, user.salt)
      //     }
      //   ).then(function (updated) {
      //     req.session.user = updated;
      //     return showMessage('密码修改成功!', user, true);
      //   }).fail(function (err) {
      //     console.error(err);
      //   });
      //   break;
      // default:
      //   break;
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
    required: ['post'],
    post: {
      body: {
        email: {
          type: 'email',
          required: true
        },
        username: {
          type: 'string',
          required: true
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
        }
      }
    }
  }
};
