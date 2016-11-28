var isLogin = require('../../policies/isLogin');
var at = require('../../util/at');
var config = require('../../../config');

function onError(err, req, res, extracted) {
  res.status(403);
  return res.render('topic/edit', {
    error: err,
    title: extracted.title,
    content: extracted.content,
    tabs: config.tabs
  });
}

module.exports = {
  urls: [
    '/topic/:id',
    '/thread/:id',
    '/v2/thread/:id'
  ],
  routers: {
    get: function (req, res) {
      res.render('topic/edit', {
        tabs: config.tabs
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
    get: isLogin
  },
  validations: {
    post: {
      body: {
        title: {
          type: 'string',
          require: true,
        },
        content: {
          type: 'text',
          require: true
        },
        tab: {
          type: 'string',
          require: true
        }
      }
    }
  }
};
