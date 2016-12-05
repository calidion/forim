// var password = require('../../util/password');
var uuid = require('node-uuid');
var mailer = require('../../util/mailer');

function onFailure(err, req, res) {
  res.showPage('sign/search_pass', {
    error: err
  }, 422);
}
module.exports = {
  urls: ['/search_pass', '/v2/password/retrieve'],
  routers: {
    get: function (req, res) {
      res.showPage('sign/search_pass');
    },
    post: function (req, res) {
      var extracted = req.extracted.body;
      var User = req.models.User;
      User.findOne({
        email: extracted.email
      }).then(function (found) {
        if (!found) {
          return onFailure('邮箱不存在!', req, res);
        }
        found.passwordRetrieveKey = uuid.v4();
        found.passwordRetrieveTime = new Date().getTime();
        found.save(function (err) {
          if (err) {
            return onFailure(err, req, res);
          }
          mailer.user.password.reset(found.email, found.retrieveKey, found.username, function () {
            res.showPage('notify/notify', {
              success: '我们已给您填写的电子邮箱发送了一封邮件，请在24小时内点击里面的链接来重置密码。'
            });
          });
        });
      }).fail(function (err) {
        onFailure(err, req, res, req.body);
      });
    }
  },
  validations: {
    post: {
      body: {
        email: {
          type: 'email',
          required: true
        }
      }
    }
  },
  faulures: {
    validation: function (data, req, res) {
      onFailure('邮箱不正确!', req, res);
    }
  }
};
