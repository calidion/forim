var password = require('../../../util/password');
var uuid = require('node-uuid');

module.exports = {
  urls: [
    '/auth/github/create',
    '/v2/oauth/github/create'
  ],
  routers: {
    get: function (req, res) {
      res.render('sign/new_oauth', {
        actionPath: '/auth/github/create'
      });
    },
    post: function (req, res) {
      var User = req.models.User;
      var extracted = req.extracted.body;
      var profile = req.session.user;

      if (!profile) {
        return res.redirect('/signin');
      }
      var email = profile.emails && profile.emails[0] && profile.emails[0].value;
      // 新建账号
      if (extracted.create) {
        return User.findOne({
          email: email
        }).then(function (found) {
          if (!found) {
            return User.create({
              username: profile.username,
              password: profile.accessToken,
              email: email,
              avatar: profile._json.avatar_url,
              githubId: profile.id,
              githubUsername: profile.username,
              githubAccessToken: profile.accessToken,
              active: true,
              accessToken: uuid.v4()
            });
          }
          return found;
        }).then(function (finalized) {
          req.session.user = finalized;
          res.redirect('/');
        }).fail(function (err) {
          console.error(err);
          res.status(500).send('Unknown Server Error!');
        });
      }
      // 关联老账号
      User.findOne({
        username: extracted.username
      }).then(function (found) {
        if (!found) {
          return res.status(403).render('sign/signin', {
            error: '用户名未找到!'
          });
        }
        if (!password.compare(extracted.password, found.salt, found.password)) {
          return res.status(403).render('sign/signin', {
            error: '密码错误!'
          });
        }
        found.githubUsername = profile.username;
        found.githubId = profile.id;
        // user.loginname = profile.username;
        found.avatar = profile._json.avatar_url;
        found.githubAccessToken = profile.accessToken;

        found.save(function (err) {
          if (err) {
            return res.status(500)
              .send('服务器未知错误');
          }
          req.session.user = found;
          res.redirect('/');
        });
      });
    }
  },
  validations: {
    post: {
      body: {
        create: {
          type: 'int'
        },
        username: {
          type: 'string',
          minLength: 2
        },
        password: {
          type: 'string',
          minLength: 6
        }
      }
    }
  }
};

