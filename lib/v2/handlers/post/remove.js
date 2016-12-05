var isPostAuthor = require('../../policies/isPostAuthor');
module.exports = {
  urls: [
    '/post/remove',
    '/v2/post/remove'
  ],
  routers: {
    post: function (req, res) {
      var Post = req.models.Post;
      var User = req.models.User;
      var Thread = req.models.Thread;
      var user = req.session.user;
      var thread;
      var post = req._post;
      thread = post.thread;
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
      Promise.all(
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
              id: post.id
            }
          )
        ]
      ).then(function () {
        res.json({
          status: 'success'
        });
      }).catch(function (err) {
        console.error(err);
        res.json({
          status: 'failed'
        });
      });
    }
  },
  policies: {
    all: isPostAuthor
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
