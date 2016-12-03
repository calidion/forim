var isAdmin = require('../../policies/isAdmin');
module.exports = {
  urls: ['/user/clear', '/v2/user/clear'],
  routers: {
    post: function (req, res) {
      var User = req.models.User;
      var Thread = req.models.Thread;
      var Post = req.models.Post;
      var PostLike = req.models.PostLike;
      var username = req.extracted.body.username;
      User.findOne({
        username: username
      }).then(function (found) {
        if (!found) {
          return res.json({
            status: 'failed',
            message: '用户不存在'
          });
        }
        return Promise.all([
          Thread.destroy({
            author: found.id
          }),
          Post.destroy({
            author: found.id
          }),
          PostLike.destroy({
            author: found.id
          })
        ]);
      }).then(function () {
        res.json({
          status: 'success'
        });
      }).fail(function (err) {
        console.error(err);
        res.json({
          status: 'failed'
        });
      });
    }
  },
  policies: {
    all: isAdmin
  },
  validations: {
    post: {
      required: ['post'],
      body: {
        username: {
          type: 'string',
          required: true
        }
      }
    }
  }
};
