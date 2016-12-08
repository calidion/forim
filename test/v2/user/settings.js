var http = require('supertest');
var shared = require('../shared');
var server = require('../app');
var app;

describe('v2 user#settings', function () {
  var username = shared.user.username;
  var password = shared.user.password;
  var cookies;

  before(function (done) {
    server(function (data) {
      app = data;
      done();
    });
  });

  it('should login in successful', function (done) {
    var req = http(app);
    req.post('/user/login')
      .send({
        username: username,
        password: password
      })
      .end(function (err, res) {
        var re = new RegExp('; path=/; httponly', 'gi');
        cookies = res.headers['set-cookie']
          .map(function (r) {
            return r.replace(re, '');
          }).join("; ");
        shared.cookies = cookies;
        res.status.should.equal(302);
        res.headers.location.should.equal('/');
        done(err);
      });
  });

  it('should not show setting page', function (done) {
    var req = http(app).get('/user/settings');
    req
      .expect(403, function (err, res) {
        res.text.should.containEql('Forbidden!');
        done(err);
      });
  });
  it('should not show setting page', function (done) {
    var req = http(app).post('/user/settings');
    req
      .expect(403, function (err, res) {
        res.text.should.containEql('Forbidden!');
        done(err);
      });
  });
  it('should show setting page', function (done) {
    var req = http(app).get('/user/settings');
    req.cookies = cookies;
    req
      .expect(200, function (err, res) {
        res.text.should.containEql('同时决定了 Gravatar 头像');
        res.text.should.containEql('Access Token');
        done(err);
      });
  });

  it('should show setting page', function (done) {
    var req = http(app).get('/user/settings');
    req.cookies = cookies;
    req
      .expect(200, function (err, res) {
        res.text.should.containEql('同时决定了 Gravatar 头像');
        res.text.should.containEql('Access Token');
        done(err);
      });
  });

  it('should change user setting', function (done) {
    var userInfo = {
      url: 'http://forum.webfullstack.me',
      location: 'Sky world',
      weibo: 'http://weibo.com/forim',
      github: '@forim',
      signature: '仍然很懒',
      username: shared.user.username,
      email: shared.user.email
    };
    var req = http(app).post('/user/settings');
    req.cookies = cookies;
    req
      .send(userInfo)
      .expect(302, function (err, res) {
        res.headers.location.should.equal('/user/settings?save=success');
        done(err);
      });
  });

  it('should show success info', function (done) {
    var req = http(app).get('/user/settings');
    req.cookies = cookies;
    req.query({
      save: 'success'
    })
      .expect(200, function (err, res) {
        res.text.should.containEql('保存成功。');
        done(err);
      });
  });
});
