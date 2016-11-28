var config = require('../../../config');
var password = require('../../util/password');
var image = require('../../util/image');
var uuid = require('node-uuid');
var mailer = require('../../util/mailer');

function onFailure(err, req, res, data) {
  res.status(422);
  res.render('sign/signup', {
    error: err,
    username: data.username,
    email: data.email
  });
}
module.exports = {
  urls: ['/signup', '/v2/user/register'],
  routers: {
    get: function (req, res) {
      if (config.allow_sign_up) {
        res.render('sign/signup');
      } else {
        res.redirect('oauth/signup');
      }
    },
    post: function (req, res) {
      var User = req.models.User;
      var extracted = req.extracted.body;
      var user = {
        password: extracted.password,
        email: extracted.email,
        username: extracted.username,
        nickname: extracted.username
      };
      User.findOne({
        or: [{
          username: extracted.username
        }, {
          email: extracted.username
        }]
      }).then(function (found) {
        if (found) {
          return onFailure(req.errors.UserExisted.message, req, res);
        }
        password.hash().then(function (salt) {
          user.salt = salt;
          user.password = password.create(extracted.password, salt);
          user.avatar = image.makeAvatar(extracted.email || extracted.username);
          user.active = false;
          user.accessToken = password.tokenize(String(uuid.v4()));
          User.create(user).then(function (created) {
            mailer.user.activate(created.email, created.accessToken, created.username, function () {
              res.render('sign/signup', {
                success: '欢迎加入 ' + config.name + '！我们已给您的注册邮箱发送了一封邮件，请点击里面的链接来激活您的帐号。'
              });
            });
          }).fail(function (err) {
            onFailure(err, req, res, req.body);
          });
        }).catch(function (err) {
          onFailure(err, req, res, req.body);
        });
      }).fail(function (err) {
        onFailure(err, req, res, req.body);
      });
    }
  },
  validations: {
    post: {
      body: {
        username: {
          type: 'string',
          maxLength: 32,
          minLength: 2,
          required: true
        },
        email: {
          type: 'email'
        },
        password: {
          type: 'string',
          maxLength: 64,
          minLength: 6,
          required: true
        },
        confirm: {
          matches: 'password'
        }
      }
    }
  },
  faulures: {
    validation: function (err, req, res) {
      onFailure(err.data, req, res, req.body);
    }
  }
};
