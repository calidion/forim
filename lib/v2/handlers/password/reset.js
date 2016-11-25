var password = require('../../util/password');

function onFailure(err, req, res) {
  // res.status(422);
  res.render('notify/notify', {
    error: err
  });
}

function userCheck(req, res, cb) {
  var extracted = req.extracted;
  var User = req.models.User;
  var query = {
    username: extracted.username,
    passwordRetrieveKey: extracted.key
  };
  User.findOne(query).then(function (found) {
    if (!found) {
      return onFailure('信息不匹配或者存在错误，请重新请求！', req, res);
    }
    if (!found.passwordRetrieveTime) {
      return onFailure('重置请求并未发起！', req, res);
    }
    if (found.passwordRetrieveTime + 1000 * 60 * 60 * 24 < new Date().getTime()) {
      return onFailure('链接已经过期，请重新请求!', req, res);
    }
    cb(found);
  }).fail(function (err) {
    onFailure(err, req, res);
  });
}
module.exports = {
  urls: ['/reset_pass', '/v2/password/reset'],
  routers: {
    get: function (req, res) {
      userCheck(req, res, function () {
        res.render('sign/reset', req.extracted);
      });
    },
    post: function (req, res) {
      userCheck(req, res, function (found) {
        found.passwordRetrieveKey = null;
        found.passwordRetrieveTime = null;
        found.password = password.create(req.extracted.password, found.salt);
        found.save(function (err) {
          if (err) {
            return onFailure(err, req, res);
          }
          return res.render('notify/notify', {
            success: '你的密码已重置。'
          });
        });
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
        key: {
          type: 'string',
          required: true
        }
      }
    },
    post: {
      body: {
        username: {
          type: 'string',
          required: true
        },
        key: {
          type: 'string',
          required: true
        },
        password: {
          type: 'string',
          required: true
        },
        confirm: {
          matches: 'password'
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
