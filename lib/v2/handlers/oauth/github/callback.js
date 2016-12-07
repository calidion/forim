var passport = require('passport');
var uuid = require('node-uuid');
module.exports = {
  urls: [
    '/auth/github/callback',
    '/v2/oauth/github/callback'
  ],
  routers: {
    get: function (req, res) {
      var User = req.models.User;
      var profile = req.user;
      User.findOne({
        githubId: profile.id
      }).then(function (found) {
        if (!found) {
          req.session.user = null;
          var email = profile.emails && profile.emails[0] && profile.emails[0].value;
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
        return User.update(
          {
            id: found.id
          }, {
            githubUsername: profile.username,
            githubAccessToken: profile.accessToken,
            avatar: profile._json.avatar_url
          }
        );

      }).then(function (user) {
        req.session.user = user;
        if (user.length) {
          req.session.user = user[0];
        }
        return res.redirect('/');
      }).fail(function (err) {
        console.error(err);
        return res.status(500)
          .send('服务器未知错误:' + err);
      });
    }
  },
  middlewares: {
    get: passport.authenticate('github', {
      failureRedirect: '/auth/github'
    })
  }
};

