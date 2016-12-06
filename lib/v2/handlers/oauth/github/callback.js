var passport = require('passport');
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
          req.session.user = profile;
          return res.redirect('/auth/github/create');
        }
        return User.update(
          {
            id: found.id
          }, {
            githubUsername: profile.username,
            githubAccessToken: profile.accessToken,
            avatar: profile._json.avatar_url
          }
        ).then(function (user) {
          req.session.user = user;
          return res.redirect('/');
        }).fail(function (err) {
          console.error(err);
          return res.status(500)
            .send('服务器未知错误:' + err);
        });
      }).fail(function (err) {
        console.error(err);
      });
    }
  },
  middlewares: {
    get: passport.authenticate('github', {
      failureRedirect: '/auth/github'
    })
  }
};

