var http = require('supertest');
var shared = require('../shared');
var server = require('../app');
var app;

describe('v2 user#activate', function () {
  var username = shared.user.username;
  before(function (done) {
    server(function (data) {
      app = data;
      done();
    });
  });
  it('should activate no account', function (done) {
    var req = http(app);
    req.get('/user/activate').query({
      token: 'sdf',
      username: 'sdf'
    }).expect(200, function (err, res) {
      res.text.should.containEql('用户未找到!');
      done(err);
    });
  });
  it('should activate bad token', function (done) {
    var req = http(app);
    req.get('/user/activate').query({
      token: 'sdf',
      username: username
    }).expect(200, function (err, res) {
      res.text.should.containEql('Token不正确!');
      done(err);
    });
  });
  it('should activate an account', function (done) {
    app.models.User.findOne({
      username: username
    }).then(function (found) {
      var req = http(app);
      req.get('/user/activate').query({
        token: found.accessToken,
        username: username
      }).expect(200, function (err, res) {
        res.text.should.containEql('帐号激活成功，你可以现在登录论坛了!');
        done(err);
      });
    });
  });
  it('should activate an account', function (done) {
    app.models.User.findOne({
      username: username
    }).then(function (found) {
      var req = http(app);
      req.get('/user/activate')
        .query({
          token: found.accessToken,
          username: username
        })
        .expect(200, function (err, res) {
          res.text.should.containEql('帐号已经激活!');
          done(err);
        });
    });
  });
});
