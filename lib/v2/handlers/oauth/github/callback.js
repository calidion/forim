var passport = require('passport');
module.exports = {
  urls: [
    '/auth/github/callback',
    '/v2/oauth/github/callback'
  ],
  routers: {
    get: function (req, res, next) {
      var User = req.models.User;
      var profile = req.user;
      User.findOne({
        githubId: profile.id
      }).then(function (found) {
        if (!found) {
          req.session.user = profile;
          return res.redirect('/auth/github/create');
        }
        found.githubUsername = profile.username;
        found.githubId = profile.id;
        found.githubAccessToken = profile.accessToken;
        found.avatar = profile._json.avatar_url;
        found.save(function (err) {
          if (err) {
            return res.status(500)
              .send('服务器未知错误');
          }
          req.session.user = found;
          return res.redirect('/');
        });
      }).fail(function (err) {
        next(err);
      });
    }
  },
  middlewares: {
    get: passport.authenticate('github', {
      failureRedirect: '/auth/github'
    })
  }
};

