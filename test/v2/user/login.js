var http = require('supertest');
var assert = require('assert');
var shared = require('../shared');
var server = require('../app');
var app;

describe('v2 user#login', function () {
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

  it('should visit login page', function (done) {
    var req = http(app);
    req.get('/user/login').end(function (err, res) {
      res.text.should.containEql('登录');
      res.text.should.containEql('通过 GitHub 登录');
      done(err);
    });
  });

  it('should visit login page', function (done) {
    var req = http(app);
    req.get('/v2/user/login').end(function (err, res) {
      res.text.should.containEql('登录');
      res.text.should.containEql('通过 GitHub 登录');
      done(err);
    });
  });

  it('should get errors when there is no username or no password provided', function (done) {
    var req = http(app);
    req.post('/user/login')
      .send({
        username: username,
        password: ''
      })
      .end(function (err, res) {
        res.status.should.equal(422);
        res.text.should.containEql('输入错误!');
        done(err);
      });
  });
  it('should get errors when there is no username or no password provided', function (done) {
    var req = http(app);
    req.post('/v2/user/login')
      .send({
        username: username,
        password: ''
      })
      .end(function (err, res) {
        res.status.should.equal(422);
        res.text.should.containEql('输入错误!');
        done(err);
      });
  });

  it('should not login in when not actived', function (done) {
    var req = http(app);
    req.post('/user/login')
      .send({
        username: username,
        password: password
      })
      .end(function (err, res) {
        res.status.should.equal(403);
        res.text.should.containEql('此帐号还没有被激活，激活链接已发送到');
        done(err);
      });
  });
});