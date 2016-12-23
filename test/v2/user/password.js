var http = require('supertest');
var shared = require('../shared');
var server = require('../app');
var app;

describe('v2 user#login', function () {
  var username = shared.user.username;
  var email = shared.user.email;

  before(function (done) {
    server(function (data) {
      app = data;
      done();
    });
  });

  it('should 200 when get /password/retrieve', function (done) {
    var req = http(app);
    req.get('/password/retrieve')
      .expect(200, function (err, res) {
        res.text.should.containEql('找回密码');
        done(err);
      });
  });

  it('should update search pass', function (done) {
    var req = http(app);
    req.post('/password/retrieve')
      .send({
        email: email
      })
      .expect(200, function (err, res) {
        res.text.should.containEql('我们已给您填写的电子邮箱发送了一封邮件，请在24小时内点击里面的链接来重置密码。');
        done(err);
      });
  });

  it('should 200 when get /password/reset', function (done) {
    app.models.User.findOne({
      username: username
    }).then(function (found) {
      var req = http(app);
      req.get('/password/reset')
        .query({
          key: found.passwordRetrieveKey,
          username: username
        })
        .expect(200, function (err, res) {
          res.text.should.containEql('重置密码');
          done(err);
        });
    });
  });
  it('should 403 get /password/reset when with wrong resetKey', function (done) {
    var req = http(app);
    req.get('/password/reset')
      .query({
        key: 'wrongkey',
        username: username
      })
      .expect(200, function (err, res) {
        res.text.should.containEql('信息不匹配或者存在错误，请重新请求！');
        done(err);
      });
  });

  it('should update password', function (done) {
    app.models.User.findOne({
      username: username
    }).then(function (found) {
      var req = http(app);
      shared.user.password = 'jkljkljkl';
      req.post('/password/reset')
        .send({
          password: shared.user.password,
          confirm: shared.user.password,
          key: found.passwordRetrieveKey,
          username: username
        })
        .expect(200, function (err, res) {
          res.text.should.containEql('你的密码已重置。');
          done(err);
        });
    });
  });
  it('should login in successfully again', function (done) {
    var req = http(app);
    req.post('/user/login')
      .send({
        username: username,
        password: shared.user.password
      })
      .end(function (err, res) {
        var re = new RegExp('; path=/; httponly', 'gi');
        var cookies = res.headers['set-cookie']
          .map(function (r) {
            return r.replace(re, '');
          }).join("; ");
        shared.cookies = cookies;
        res.status.should.equal(302);
        res.headers.location.should.equal('/');
        done(err);
      });
  });
});
