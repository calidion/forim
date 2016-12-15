var passport = require('passport');
var config = require('../../../../config');
module.exports = {
  urls: [
    '/auth/github',
    '/oauth/github',
    '/v2/oauth/github/login'
  ],
  routers: {
    get: passport.authenticate('github')
  },
  policies: {
    get: function (req, res, next) {
      if (config.oauth.github.clientID === 'your GITHUB_CLIENT_ID') {
        return res.send('call the admin to set github oauth.');
      }
      if (req.query.url) {
        req.session.url = req.query.url;
      }
      next(true);
    }
  }
};

