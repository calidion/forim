var http = require('supertest');
var assert = require('assert');
// var user = require('../../lib/v2/routers/user');
var server = require('./app');
var app;

describe('v2 user', function () {
  var now = Number(new Date());
  var username = 'testuser' + now;
  var email = 'testuser' + now + '@gmail.com';
  var password = 'wtffffffffffff';
  var id = 1;

  before(function (done) {
    server(function (data) {
      app = data;
      done();
    });
  });
  it('should visit sign up page', function (done) {
    var req = http(app);
    req.get('/signup')
      .expect(200, function (err, res) {
        assert(!err);
        res.text.should.containEql('确认密码');
        done();
      });
  });
  it('should visit sign up page', function (done) {
    var req = http(app);
    req.get('/v2/user/register')
      .expect(200, function (err, res) {
        assert(!err);
        res.text.should.containEql('确认密码');
        done();
      });
  });
  it('should signup', function (done) {
    var req = http(app);
    req.post('/signup')
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
  it('should not signup with existing username', function (done) {
    var req = http(app);
    req.post('/signup')
      .send({
        username: username,
        email: 'a' + email,
        password: password,
        confirm: password
      })
      .expect(422)
      .end(done);
  });
  it('should not signup with existing email', function (done) {
    var req = http(app);
    req.post('/signup')
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
    req.get('/signin').end(function (err, res) {
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

  it('should get errors when there is no username or no password provided', function (done) {
    var req = http(app);
    req.post('/signin')
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
    req.post('/signin')
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
  it('should activate no account', function (done) {
    var req = http(app);
    req.get('/active_account')
      .query({
        token: 'sdf',
        username: 'sdf'
      })
      .expect(200, function (err, res) {
        res.text.should.containEql('用户未找到!');
        done(err);
      });
  });
  it('should activate bad token', function (done) {
    var req = http(app);
    req.get('/active_account')
      .query({
        token: 'sdf',
        username: username
      })
      .expect(200, function (err, res) {
        res.text.should.containEql('Token不正确!');
        done(err);
      });
  });
  it('should activate an account', function (done) {
    app.models.User.findOne({
      username: username
    }).then(function (found) {
      var req = http(app);
      req.get('/active_account')
        .query({
          token: found.accessToken,
          username: username
        })
        .expect(200, function (err, res) {
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
      req.get('/active_account')
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

  it('should login in successful', function (done) {
    var req = http(app);
    req.post('/signin')
      .send({
        username: username,
        password: password
      })
      .end(function (err, res) {
        res.status.should.equal(302);
        res.headers.location.should.equal('/');
        done(err);
      });
  });

  it('should sign out', function (done) {
    var req = http(app);
    req.get('/signout')
      .expect(302)
      .end(done);
  });
  it('should sign out', function (done) {
    var req = http(app);
    req.post('/signout')
      .expect(302)
      .end(done);
  });


  it('should 200 when get /search_pass', function (done) {
    var req = http(app);
    req.get('/search_pass')
      .expect(200, function (err, res) {
        res.text.should.containEql('找回密码');
        done(err);
      });
  });

  it('should 200 when get /search_pass', function (done) {
    var req = http(app);
    req.get('/v2/password/retrieve')
      .expect(200, function (err, res) {
        res.text.should.containEql('找回密码');
        done(err);
      });
  });

  it('should update search pass', function (done) {
    var req = http(app);
    req.post('/search_pass')
      .send({
        email: email
      })
      .expect(200, function (err, res) {
        res.text.should.containEql('我们已给您填写的电子邮箱发送了一封邮件，请在24小时内点击里面的链接来重置密码。');
        done(err);
      });
  });

  it('should 200 when get /reset_pass', function (done) {
    app.models.User.findOne({
      username: username
    }).then(function (found) {
      var req = http(app);
      req.get('/reset_pass')
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
  it('should 403 get /reset_pass when with wrong resetKey', function (done) {
    var req = http(app);
    req.get('/reset_pass')
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
      req.post('/reset_pass')
        .send({
          password: 'jkljkljkl',
          confirm: 'jkljkljkl',
          key: found.passwordRetrieveKey,
          username: username
        })
        .expect(200, function (err, res) {
          res.text.should.containEql('你的密码已重置。');
          done(err);
        });
    });
  });

  it('should get user list', function (done) {
    process.env.FORIM_BY_PASS_POLICIES = 1;
    var req = http(app);
    req.get('/v2/user?limit=10&page=1')
      .end(function (error, res) {
        assert(!error);
        var body = res.body;
        assert(body.code === 0);
        var data = body.data;
        assert(data.total >= 0);
        assert(data.page >= 0);
        assert(data.count >= 0);
        assert(data.results.length >= 0);
        if (data.results.length >= 1) {
          id = data.results[0].id;
        }
        done();
      });
  });

  it('should get user info', function (done) {
    process.env.FORIM_BY_PASS_POLICIES = 1;
    var req = http(app);
    req.get('/v2/user/profile/' + id)
      .end(function (error, res) {
        assert(!error);
        var body = res.body;
        assert(body.code === 0);
        assert(body.data);
        done();
      });
  });

  it('should not get user', function (done) {
    process.env.FORIM_BY_PASS_POLICIES = 1;
    var req = http(app);
    req.get('/v2/user/profile/100000')
      .end(function (error, res) {
        assert(!error);
        var body = res.body;
        assert(body.name === 'NotFound');
        assert(!body.data);
        done();
      });
  });

  it('should get 403', function (done) {
    process.env.FORIM_BY_PASS_POLICIES = 0;
    var req = http(app);
    req.get('/v2/user/profile/100000')
      .expect(403)
      .end(done);
  });
});
