var http = require('supertest');
var shared = require('./shared');
var server = require('./app');
var app;

describe('v2 user', function () {
  before(function (done) {
    server(function (data) {
      app = data;
      done();
    });
  });

  require('./user/register');
  require('./user/login');
  require('./user/activate');
  require('./user/settings');
  require('./user/logout');
  require('./user/password');
  require('./user/page');
  require('./user/list');
  require('./user/detail');
  require('./user/block');
  require('./user/star');
  require('./user/profile');

  describe('#main', function () {
    it('should get /user/top', function (done) {
      var req = http(app);
      req.get('/user/top')
        .expect(200, function (err, res) {
          res.text.should.containEql('Top100 积分榜');
          done(err);
        });
    });

    it('should clear a user', function (done) {
      var req = http(app);
      req.post('/user/clear')
        .send({
          username: shared.user.username
        })
        .expect(200, function (err, res) {
          res.body.status.should.eql('success');
          done(err);
        });
    });
  });
});
