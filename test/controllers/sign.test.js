var app = require('../../lib/app');
var request = require('supertest')(app);
var mm = require('mm');
var config = require('../../lib/config');
var passport = require('passport');
var configMiddleware = require('../../lib/middlewares/conf');

describe('test/controllers/sign.test.js', function () {
  afterEach(function () {
    mm.restore();
  });

  describe('sign up', function () {
    it('should redirect to github oauth page', function (done) {
      mm(config.GITHUB_OAUTH, 'clientID', 'clientID chenged');
      app.get('/signup_github', configMiddleware.github, passport.authenticate('github'));
      request.get('/signup_github')
        .expect(302, function (err, res) {
          res.headers.location.should.containEql('https://github.com/login/oauth/authorize?');
          done(err);
        });
    });
  });
});
