var isLogin = require('../../policies/isLogin');
var at = require('../../util/at');
var config = require('../../../config');

module.exports = {
  urls: [
    '/post/create/:id',
    '/v2/post/create/:id'
  ],
  routers: {
    get: function (req, res) {
      res.showPage('post/edit', {
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

      Thread.findOne({
        id: extracted.params.id
      }).populate('author').then(function (found) {
        thread = found;
        if (!thread) {
          res.showPage('notifiy/notify', {
            err: '主题不存在!'
          });
          return false;
        }
        if (thread.locked) {
          res.showPage('notifiy/notify', {
            err: '主题已经锁定!'
          });
          return false;
        }
        return Post.create({
          thread: thread.id,
          content: extracted.body.content,
          author: user.id,
          parent: extracted.body.parent
        });
      }).then(function (created) {
        post = created;
        var filter = post.content.replace('@' + user.username + ' ', '');
        return Promise.all([
          Thread.update(
            {
              id: thread.id
            }, {
              lastReplier: user.id,
              lastReplyAt: new Date()
            }
          ),
          User.update(
            {
              id: user.id
            }, {
              score: Number(user.score - 0) + 5,
              replies: Number(user.replies - 0) + 1
            }
          ),
          new Promise(function (resolve) {
            at.parse(req, filter, {
              type: 'reply',
              sender: user.id,
              author: user.id,
              parent: extracted.body.parent
            }, resolve);
          })
        ]
        );
      }).then(function () {
        res.redirect('/thread/visit/' + thread.id + '#' + post.id);
      }).fail(function (err) {
        console.error(err);
      });
    }
  },
  policies: {
    all: isLogin
  },
  validations: {
    post: {
      required: ['params', 'body'],
      params: {
        id: {
          type: 'string',
          required: true
        }
      },
      body: {
        parent: {
          type: 'string'
        },
        content: {
          type: 'text',
          required: true
        }
      }
    }
  }
};
