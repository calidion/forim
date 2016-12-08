var http = require('supertest');
var assert = require('assert');
var shared = require('../shared');
var server = require('../app');
var app;

describe('v2 user#register', function () {
  var username = shared.user.username;
  var email = shared.user.email;
  var password = shared.user.password;
  var id = 1;
  var cookies;

  before(function (done) {
    server(function (data) {
      app = data;
      done();
    });
  });

  it('should visit register page', function (done) {
    var req = http(app);
    req.get('/user/register')
      .expect(200, function (err, res) {
        assert(!err);
        res.text.should.containEql('确认密码');
        done();
      });
  });
  it('should visit register page', function (done) {
    var req = http(app);
    req.get('/v2/user/register')
      .expect(200, function (err, res) {
        assert(!err);
        res.text.should.containEql('确认密码');
        done();
      });
  });
  it('should register', function (done) {
    var req = http(app);
    req.post('/user/register')
      .send({
        username: username,
        email: email,
        password: password,
        confirm: password
      })
      .expect(200, function (err, res) {
        assert(!err);
        res.text.should.containEql('欢迎加入');
        done();
      });
  });
  it('should not register with existing username', function (done) {
    var req = http(app);
    req.post('/user/register')
      .send({
        username: username,
        email: 'a' + email,
        password: password,
        confirm: password
      })
      .expect(422)
      .end(done);
  });
  it('should not register with existing email', function (done) {
    var req = http(app);
    req.post('/user/register')
      .send({
        username: 'a' + username,
        email: email,
        password: password,
        confirm: password
      })
      .expect(422)
      .end(done);
  });
  it('should visit sign in page', function (done) {
    var req = http(app);
    req.get('/user/login').end(function (err, res) {
      res.text.should.containEql('登录');
      res.text.should.containEql('通过 GitHub 登录');
      done(err);
    });
  });

  it('should visit sign in page', function (done) {
    var req = http(app);
    req.get('/v2/user/login').end(function (err, res) {
      res.text.should.containEql('登录');
      res.text.should.containEql('通过 GitHub 登录');
      done(err);
    });
  });
});