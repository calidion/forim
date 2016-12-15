var password = require('../../util/password');
var mailer = require('../../util/mailer');

function onFailure(err, req, res) {
  res.status(422);
  res.showPage('sign/signin', {
    error: err
  });
}
var noneRedirectable = [
  '/user/activate', // active page
  '/reset_pass', // reset password page, avoid to reset twice
  '/password/reset', // reset password page, avoid to reset twice
  '/user/register', // regist page
  '/password/retrieve' // serch pass page
];
module.exports = {
  urls: ['/user/login', '/v2/user/login'],
  routers: {
    get: function (req, res) {
      req.session._loginReferer = req.headers.referer;
      res.showPage('sign/signin');
    },
    post: function (req, res) {
      var User = req.models.User;
      var extracted = req.extracted.body;

      User.findOne({
        or: [{
          username: extracted.username
        }, {
          email: extracted.username
        }]
      }).then(function (found) {
        if (!found) {
          return onFailure(res.errors.UserNotFound.message, req, res);
        }
        if (!password.compare(extracted.password, found.salt, found.password)) {
          return onFailure(res.errors.Failure, req, res);
        }
        if (!found.active) {
          return mailer.user.activate(found.email,
            found.accessToken,
            found.username,
            function () {
              res.status(403);
              return res.showPage('sign/signin', {
                error: '此帐号还没有被激活，激活链接已发送到 ' + found.email + ' 邮箱，请查收。'
              });
            });
        }
        req.session.user = found;
        var refer = req.session._loginReferer || '/';
        for (var i = 0; i < noneRedirectable.length; i++) {
          if (refer.indexOf(noneRedirectable[i]) >= 0) {
            res.redirect('/');
            return;
          }
        }
        res.redirect(refer);
      }).fail(function (error) {
        console.error(error);
        onFailure(error, req, res);
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
        password: {
          type: 'string',
          maxLength: 64,
          minLength: 4,
          required: true
        }
      }
    }
  },
  failures: {
    validation: function (err, req, res) {
      console.error(err, req.body, req.query, req.params);
      onFailure('输入错误!', req, res, req.body);
    }
  }
};

