var isLogin = require('../../policies/isLogin');

function onError(err, req, res) {
  res.status(403);
  return res.showPage('notify/notify', {
    error: err
  });
}

module.exports = {
  urls: [
    '/thread/unfavorite',
    '/v2/thread/unfavorite'
  ],
  routers: {
    post: function (req, res) {
      var Thread = req.models.Thread;
      var User = req.models.User;
      var Favorite = req.models.Favorite;
      var user = req.session.user;
      var extracted = req.extracted.body;

      Thread.findOne({
        id: extracted.id
      }).then(function (thread) {
        if (!thread) {
          return res.json({
            status: 'failed'
          });
        }
        Favorite.destroy({
          owner: user.id,
          thread: thread.id
        }).then(function () {
          user.favoriteThreads--;
          thread.favorites--;
          Promise.all(
            [
              User.update(
                {
                  id: user.id
                }, {
                  favoriteThreads: user.favoriteThreads
                }
              ),
              Thread.update(
                {
                  id: thread.id
                }, {
                  favorites: thread.favorites
                }
              )
            ]
          ).then(function () {
            res.json({
              status: 'success'
            });
          }).catch(function (err) {
            console.error(err);
          });
        });
      }).fail(function (err) {
        console.error(err);
        return res.json({
          status: 'failed'
        });
      });
    }
  },
  policies: {
    all: isLogin
  },
  validations: {
    post: {
      body: {
        id: {
          type: 'string',
          required: true
        }
      }
    }
  },
  failures: {
    policy: function (data, req, res) {
      onError('你无权删除当前话题!', req, res);
    },
    validation: function (data, req, res) {
      onError('输入不正确!', req, res);
    }
  }
};
