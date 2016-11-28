var isLogin = require('../../policies/isLogin');
var at = require('../../util/at');
var config = require('../../../config');

function onError(err, req, res) {
  res.status(403);
  return res.render('notify/notify', {
    error: err
  });
}

module.exports = {
  urls: [
    '/topic/de_collect',
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
        id: extracted.id,
      }).then(function (thread) {
        if (!thread) {
          return res.json({
            status: 'failed'
          });
        }
        Favorite.destroy({
          owner: user.id,
          thread: thread.id
        }).then(function (favorite) {
          user.favoriteThreads--;
          thread.favorites--;
          Promise.all([User.update({
            id: user.id
          }, {
            favoriteThreads: user.favoriteThreads
          }), Thread.update({
            id: thread.id
          }, {
            favorites: thread.favorites
          })]).then(function (result) {
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
    policy: function (err, req, res, next) {
      onError('你无权删除当前话题!', req, res);
    },
    validation: function (err, req, res, next) {
      onError('输入不正确!', req, res);
    }
  }
};
