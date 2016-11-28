var isLogin = require('../../policies/isLogin');
var at = require('../../util/at');
var config = require('../../../config');

function onError(err, req, res, extracted) {
  res.status(403);
  return res.render('thread/edit', {
    error: err,
    title: extracted.title,
    content: extracted.content,
    tabs: config.tabs
  });
}

module.exports = {
  urls: [
    '/thread/create',
    '/v2/thread/create'
  ],
  routers: {
    get: function (req, res) {
      res.render('thread/edit', {
        tabs: config.tabs
      });
    },
    post: function (req, res) {
      var Thread = req.models.Thread;
      var User = req.models.User;
      var user = req.session.user;
      var extracted = req.extracted.body;
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
            res.redirect('/thread/visit/' + thread.id);
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
    validation: function (err, req, res, next) {
      onError(err, req, res, req.body);
    }
  }
};
