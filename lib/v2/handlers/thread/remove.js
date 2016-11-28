var isLogin = require('../../policies/isLogin');
var at = require('../../util/at');
var config = require('../../../config');

function onError(err, req, res) {
  res.status(403);
  return res.render('notify/notify', {
    error: err
  });
}

module.exports = {
  urls: [
    '/topic/:id/delete',
    '/v2/thread/delete/:id',
    '/v2/thread/remove/:id'
  ],
  routers: {
    post: function (req, res) {
      var Thread = req.models.Thread;
      var user = req.session.user;
      var extracted = req.extracted.params;

      Thread.findOne({
        id: extracted.id,
      }).then(function (found) {
        if (!found) {
          onError('此话题不存在或已被删除。', req, res);
        }
        found.isDeleted = true;
        found.save(function (err) {
          if (err) {
            return res.send({
              success: false,
              message: err.message
            });
          }
          res.send({
            success: true,
            message: '话题已被删除。'
          });
        });
      }).fail(function (err) {
        console.error(err);
        onError('服务器出错!', req, res);
      });
    }
  },
  policies: {
    all: isLogin
  },
  validations: {
    post: {
      params: {
        id: {
          type: 'string',
          required: true
        }
      }
    }
  },
  failures: {
    policy: function (err, req, res, next) {
      onError('你无权删除当前话题!', req, res);
    },
    validation: function (err, req, res, next) {
      onError('输入不正确!', req, res);
    }
  }
};
