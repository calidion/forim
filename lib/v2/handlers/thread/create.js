var isLogin = require('../policies/isLogin');
var at = require('../util/at');

function onError(err, req, res) {
  return res.render('topic/edit', {
    error: err,
    title: title,
    content: content,
    tabs: config.tabs
  });
}

module.exports = {
  urls: [
    '/topic/create',
    '/v2/thread/create',
    '/v2/thread/new'
  ],
  routers: {
    get: function (req, res) {
      res.render('topic/edit', {
        tabs: config.tabs
      });
    },
    post: function (req, res) {
      var Thread = req.models.Thread;
      var user = req.session.user;
      var extracted = req.extracted;
      extracted.author = user.id;
      Thread.create(extracted).then(function (thread) {
        user.score += 5;
        user.threads += 1;
        return user.save(function () {
          res.redirect('/topic/' + thread.id);
        }).fail(function (err) {
          onError(err, req, res);
        });
      }).then(function (saved) {
        // 发送at消息
        at.parse(req, thread.content, {
          sender: user,
          author: user
        });

      }).fail(function (err) {
        onError(err, req, res);
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
