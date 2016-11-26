var passport = require('passport');
var GitHubStrategy = require('passport-github').Strategy;
var config = require('../config');

function githubStrategyMiddleware(accessToken, refreshToken, profile, done) {
  profile.accessToken = accessToken;
  done(null, profile);
};

module.exports = function (app) {
  // oauth 中间件
  app.use(passport.initialize());
  // app.use(passport.session());

  // github oauth
  passport.serializeUser(function _serial(user, done) {
    done(null, user);
  });
  passport.deserializeUser(function _unserial(user, done) {
    done(null, user);
  });
  passport.use(new GitHubStrategy(config.oauth.github, githubStrategyMiddleware));
};
