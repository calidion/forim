var util = require('util');
function onFailure(err, req, res) {
  res.render('notify/notify', {
    error: err
  });
}
module.exports = {
  urls: ['/user/:username', '/v2/user/page/:username'],
  routers: {
    get: function (req, res) {
      var User = req.models.User;
      var Thread = req.models.Thread;
      var Post = req.models.Post;
      var username = req.params.username;
      User.findOne({
        username: username
      }).then(function (found) {
        if (!found) {
          return onFailure(res.errors.UserNotFound, req, res);
        }
        Promise.all([Thread.find({
          author: found.id
        }), Post.find({
          author: found.id
        })]).then(function (data) {
          res.render('user/index', {
            user: found,
            threads: data[0],
            posts: data[1],
            title: util.format('@%s 的个人主页',
              found.username)
          });
        }).catch(function (error) {
          console.error(error);
          onFailure(error, req, res);
        });
      }).fail(function (error) {
        console.error(error);
        onFailure(error, req, res);
      });
    }
  },
  validations: {
    get: {
      params: {
        username: {
          type: 'string',
          maxLength: 32,
          minLength: 2,
          required: true
        }
      }
    }
  },
  failures: {
    validation: function (data, req, res) {
      onFailure('用户名错误!', req, res, req.body);
    }
  }
};
