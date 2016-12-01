var http = require('supertest');
var assert = require('assert');
var shared = require('./shared');
var server = require('./app');
var app;

describe('v2 user', function () {
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
    var req = http(app).get('/user/settings')
    req.cookies = cookies;
    req.query({
      save: 'success'
    })
      .expect(200, function (err, res) {
        res.text.should.containEql('保存成功。');
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
      shared.user.password = 'jkljkljkl';
      req.post('/reset_pass')
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
    req.post('/signin')
      .send({
        username: username,
        password: shared.user.password
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

  it('should show user index', function (done) {
    var req = http(app);
    req.get('/user/page/' + shared.user.username)
      .expect(200, function (err, res) {
        var texts = [
          '注册时间',
          // '这家伙很懒，什么个性签名都没有留下。',
          '仍然很懒',
          '最近创建的话题',
          '无话题',
          '最近参与的话题',
          '无话题'
        ];
        texts.forEach(function (text) {
          res.text.should.containEql(text);
        });
        done(err);
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
  it('should not able to lock a user', function (done) {
    var req = http(app);
    req.post('/user/block')
      .send({
        username: shared.user.username
      })
      .expect(403, function (err, res) {
        res.text.should.eql('Access Denied!');
        done(err);
      });
  });
  it('should lock a user', function (done) {
    process.env.FORIM_BY_PASS_POLICIES = 1;
    var req = http(app);
    req.post('/user/block')
      .send({
        username: shared.user.username
      })
      .expect(200, function (err, res) {
        res.body.isBlocked.should.eql(true);
        done(err);
      });
  });
  it('should unlock a user', function (done) {
    var req = http(app);
    req.post('/user/block')
      .send({
        username: shared.user.username
      })
      .expect(200, function (err, res) {
        res.body.isBlocked.should.eql(false);
        done(err);
      });
  });

  it('should not unlock a user not existed', function (done) {
    var req = http(app);
    req.post('/user/block')
      .send({
        username: 'abc'
      })
      .expect(200, function (err, res) {
        res.text.should.containEql('用户未找到!');
        done(err);
      });
  });
  it('should star a user', function (done) {
    var req = http(app);
    req.post('/user/star')
      .send({
        username: shared.user.username
      })
      .expect(200, function (err, res) {
        res.body.isStar.should.eql(true);
        done(err);
      });
  });
  it('should unstar a user', function (done) {
    var req = http(app);
    req.post('/user/star')
      .send({
        username: shared.user.username
      })
      .expect(200, function (err, res) {
        res.body.isStar.should.eql(false);
        done(err);
      });
  });
  it('should not star a user not existed', function (done) {
    var req = http(app);
    req.post('/user/star')
      .send({
        username: 'abc'
      })
      .expect(200, function (err, res) {
        res.text.should.containEql('用户未找到!');
        done(err);
      });
  });
  it('should show star uses', function (done) {
    var req = http(app);
    req.get('/user/star')
      .expect(200, function (err, res) {
        res.text.should.containEql('社区达人');
        done(err);
      });
  });
});
