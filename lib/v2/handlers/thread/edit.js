var isLogin = require('../../policies/isLogin');
var at = require('../../util/at');
var config = require('../../../config');

function onError(err, req, res) {
  res.status(404);
  return res.render('notify/notify', {
    error: err
  });
}

module.exports = {
  urls: [
    '/topic/:id/edit',
    '/v2/thread/edit/:id'
  ],
  routers: {
    get: function (req, res) {
      var Thread = req.models.Thread;
      var user = req.session.user;
      var extracted = req.extracted;

      Thread.findOne({
        id: extracted.id
      }).then(function (found) {
        if (!found) {
          onError('此话题不存在或已被删除。', req, res);
        }
        res.render('topic/edit', {
          action: 'edit',
          thread: found,
          tabs: config.tabs
        });
      }).fail(function (err) {
        console.error(err);
        onError('服务器出错!', req, res);
      });
    },
    post: function (req, res) {
      var Thread = req.models.Thread;
      var User = req.models.User;
      var user = req.session.user;
      var extracted = req.extracted;
      extracted.author = user.id;
      Thread.create(extracted).then(function (thread) {
        user.score = user.score - 0 + 5;
        user.threads = user.threads - 0 + 1;
        User.update({
          id: user.id
        },
          {
            score: user.score,
            threads: user.threads
          }).then(function (updated) {
            res.redirect('/topic/' + thread.id);
          }).fail(function (err) {
            console.error(err);
            onError(err, req, res, extracted);
          });
        return thread;
      }).then(function (thread) {
        // 发送at消息
        at.parse(req, thread.content, {
          sender: user,
          author: user
        });

      }).fail(function (err) {
        console.error(err);
        onError(err, req, res, extracted);
      });
    }
  },
  policies: {
    all: isLogin
  },
  validations: {
    get: {
      params: {
        id: {
          type: 'string',
          required: true
        }
      }
    },
    post: {
      body: {
        title: {
          type: 'string',
          required: true,
        },
        content: {
          type: 'text',
          required: true
        },
        tab: {
          type: 'string',
          required: true
        }
      }
    }
  },
  failures: {
    policies: function (err, req, res, next) {
      onError('话题不能编辑，请检查是否登录!', req, res);
    }
  }
};
