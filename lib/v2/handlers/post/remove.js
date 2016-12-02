var isLogin = require('../../policies/isLogin');
var at = require('../../util/at');
var config = require('../../../config');

module.exports = {
  urls: [
    '/post/remove',
    '/v2/post/remove'
  ],
  routers: {
    get: function (req, res) {
      res.render('post/edit', {
        tabs: config.tabs
      });
    },
    post: function (req, res) {
      var Post = req.models.Post;
      var User = req.models.User;
      var Thread = req.models.Thread;
      var user = req.session.user;
      var extracted = req.extracted;
      var thread;
      var post;

      Post.findOne({
        id: extracted.body.id,
        author: user.id
      }).populate('thread').populate('author').then(function (found) {
        thread = found.thread;
        if (!thread) {
          res.render('notifiy/notify', {
            err: '主题不存在!'
          });
          return false;
        }
        if (thread.locked) {
          res.render('notifiy/notify', {
            err: '主题已经锁定!'
          });
          return false;
        }
        return Promise.all(
          [
            Thread.update(
              {
                id: thread.id
              },
              {
                replies: thread.replies - 1
              }
            ),
            User.update(
              {
                id: user.id
              },
              {
                score: user.score - 5,
                replies: user.replies - 1
              }
            ),
            Post.destroy(
              {
                id: found.id
              }
            )
          ]
        );
      }).then(function (destroyed) {
        res.json({
          status: 'success'
        });
      }).fail(function (err) {
        console.error(err);
        res.json({
          status: 'failed'
        })
      });
    }
  },
  policies: {
    all: isLogin
  },
  validations: {
    post: {
      required: ['body'],
      body: {
        id: {
          type: 'string',
          required: true
        }
      }
    }
  }
};
