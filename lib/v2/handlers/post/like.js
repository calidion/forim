var isLogin = require('../../policies/isLogin');
module.exports = {
  urls: [
    '/post/like',
    '/v2/post/like'
  ],
  routers: {
    post: function (req, res) {
      var Post = req.models.Post;
      var PostLike = req.models.PostLike;
      var user = req.session.user;
      var id = req.extracted.body.id;
      Post.findOne({
        id: id
      }).then(function (post) {
        if (!post) {
          return res.send({
            success: false,
            message: '回复不存在！'
          });
        }
        PostLike.findOne({
          post: id,
          user: user.id
        }).then(function (like) {
          if (like) {
            return Promise.all(
              [
                PostLike.destroy(
                  {
                    id: like.id
                  }
                ),
                Post.update(
                  {
                    id: id
                  },
                  {
                    likes: post.likes - 1
                  }
                ),
                0
              ]
            );
          }

          return Promise.all(
            [
              PostLike.create(
                {
                  post: id,
                  user: user.id
                }
              ),
              Post.update(
                {
                  id: id
                },
                {
                  likes: post.likes - 0 + 1
                }
              ),
              1
            ]
          );
        }).then(function (result) {
          res.send({
            success: true,
            action: result[2]
          });
        }).fail(function (err) {
          console.error(err);
          res.send({
            success: false,
            message: err
          });
        });
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
