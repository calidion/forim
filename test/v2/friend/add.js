var http = require('supertest');
var shared = require('../shared');
var server = require('../app');
var app;
var token;

var user1 = shared.newUser();
var cookie1;
var cookie2;
var cookie3;
var user2 = shared.newUser();
var user3 = shared.newUser();
var user4 = shared.newUser();

describe('v2 friend', function () {
  before(function (done) {
    server(function (data) {
      app = data;
      var MessageFriendInvite = app.models.MessageFriendInvite;
      MessageFriendInvite.destroy({}).exec(function () {
        done();
      });
    });
  });

  it('should not acceptable with other people', function (done) {
    var req = http(app).get('/friend/ack');
    req.expect(302, function (err, res) {
      res.headers.location.should.equal('/oauth/github');
      done(err);
    });
  });

  it('should add a friend not registerred', function (done) {
    process.env.FORIM_BY_PASS_POLICIES = 0;
    var req = http(app).post('/friend/add');
    req.cookies = shared.cookies;

    req.send({
      email: user1.email
    }).expect(200, function (err, res) {
      res.body.should.containDeepOrdered({
        code: 0,
        name: 'Success',
        message: '成功！',
        data: {
          email: user1.email
        }
      });
      token = res.body.data.token;
      done(err);
    });
  });

  it('should not accept an invitation', function (done) {
    process.env.FORIM_INVITATION_IGNORE = 0;
    var req = http(app).get('/friend/ack').query({
      token: token,
      email: user1.email,
      status: 'accept'
    });
    req.cookies = shared.cookies;
    req.expect(200, function (err, res) {
      res.body.should.containDeepOrdered(
        {
          code: 'EmailNotMatch',
          name: 'EmailNotMatch',
          message: 'Email不匹配！'
        });
      done(err);
    });
  });

  it('should register', function (done) {
    var req = http(app);
    req.post('/user/register')
      .send({
        username: user1.username,
        email: user1.email,
        password: user1.password,
        confirm: user1.password
      })
      .expect(200, function (err, res) {
        res.text.should.containEql('欢迎加入');
        done(err);
      });
  });

  it('should activate an account', function (done) {
    app.models.User.findOne({
      username: user1.username
    }).then(function (found) {
      var req = http(app);
      req.get('/user/activate').query({
        token: found.accessToken,
        username: user1.username
      }).expect(200, function (err, res) {
        res.text.should.containEql('帐号激活成功，你可以现在登录论坛了!');
        done(err);
      });
    });
  });

  it('should login', function (done) {
    var req = http(app);
    req.post('/user/login')
      .send({
        username: user1.username,
        password: user1.password
      })
      .end(function (err, res) {
        var re = new RegExp('; path=/; httponly', 'gi');
        var cookies = res.headers['set-cookie']
          .map(function (r) {
            return r.replace(re, '');
          }).join('; ');
        cookie1 = cookies;
        res.status.should.equal(302);
        res.headers.location.should.equal('/');
        done(err);
      });
  });

  it('should accept an invitation after login', function (done) {
    process.env.FORIM_INVITATION_IGNORE = 0;
    var req = http(app).get('/friend/ack').query({
      token: token,
      email: user1.email,
      status: 'accept'
    });
    req.cookies = cookie1;
    req.expect(200, function (err, res) {
      res.body.should.containDeepOrdered(
        {
          code: 0,
          message: '成功！',
          name: 'Success'
        });
      done(err);
    });
  });

  it('should not add self', function (done) {
    process.env.FORIM_BY_PASS_POLICIES = 0;
    var req = http(app).post('/friend/add');
    req.cookies = cookie1;
    req.send({
      email: user1.email
    }).expect(200, function (err, res) {
      res.body.should.containDeepOrdered({
        code: 'FriendSelfAdditionNotAllowed',
        message: '无法添加自己为好友！',
        name: 'FriendSelfAdditionNotAllowed'
      });
      done(err);
    });
  });

  it('should add a friend not registerred', function (done) {
    process.env.FORIM_BY_PASS_POLICIES = 0;
    var req = http(app).post('/friend/add');
    req.cookies = cookie1;
    req.send({
      email: user2.email
    }).expect(200, function (err, res) {
      res.body.should.containDeepOrdered({
        code: 0,
        name: 'Success',
        message: '成功！',
        data: {
          email: user2.email
        }
      });
      token = res.body.data.token;
      done(err);
    });
  });

  it('should register', function (done) {
    var req = http(app);
    req.post('/user/register')
      .send({
        username: user2.username,
        email: user2.email,
        password: user2.password,
        confirm: user2.password
      })
      .expect(200, function (err, res) {
        res.text.should.containEql('欢迎加入');
        done(err);
      });
  });

  it('should activate an account', function (done) {
    app.models.User.findOne({
      username: user2.username
    }).then(function (found) {
      var req = http(app);
      req.get('/user/activate').query({
        token: found.accessToken,
        username: user2.username
      }).expect(200, function (err, res) {
        res.text.should.containEql('帐号激活成功，你可以现在登录论坛了!');
        done(err);
      });
    });
  });

  it('should login', function (done) {
    var req = http(app);
    req.post('/user/login')
      .send({
        username: user2.username,
        password: user2.password
      })
      .end(function (err, res) {
        var re = new RegExp('; path=/; httponly', 'gi');
        var cookies = res.headers['set-cookie']
          .map(function (r) {
            return r.replace(re, '');
          }).join('; ');
        cookie2 = cookies;
        res.status.should.equal(302);
        res.headers.location.should.equal('/');
        done(err);
      });
  });

  it('should reject an invitation', function (done) {
    var req = http(app).get('/friend/ack').query({
      token: token,
      email: user2.email,
      status: 'reject'
    });
    req.cookies = cookie2;
    req.expect(200, function (err, res) {
      res.body.should.containDeepOrdered({
        code: 0,
        message: '成功！',
        name: 'Success'
      });
      done(err);
    });
  });

  it('should add a friend not registerred', function (done) {
    process.env.FORIM_INVITATION_IGNORE = 0;
    var req = http(app).post('/friend/add');
    req.cookies = cookie2;
    req.send({
      email: user3.email
    }).expect(200, function (err, res) {
      res.body.should.containDeepOrdered({
        code: 0,
        name: 'Success',
        message: '成功！',
        data: {
          email: user3.email
        }
      });
      token = res.body.data.token;
      done(err);
    });
  });

  it('should register', function (done) {
    var req = http(app);
    req.post('/user/register')
      .send({
        username: user3.username,
        email: user3.email,
        password: user3.password,
        confirm: user3.password
      })
      .expect(200, function (err, res) {
        res.text.should.containEql('欢迎加入');
        done(err);
      });
  });

  it('should activate an account', function (done) {
    app.models.User.findOne({
      username: user3.username
    }).then(function (found) {
      var req = http(app);
      req.get('/user/activate').query({
        token: found.accessToken,
        username: user3.username
      }).expect(200, function (err, res) {
        res.text.should.containEql('帐号激活成功，你可以现在登录论坛了!');
        done(err);
      });
    });
  });

  it('should login', function (done) {
    var req = http(app);
    req.post('/user/login')
      .send({
        username: user3.username,
        password: user3.password
      })
      .end(function (err, res) {
        var re = new RegExp('; path=/; httponly', 'gi');
        var cookies = res.headers['set-cookie']
          .map(function (r) {
            return r.replace(re, '');
          }).join('; ');
        cookie3 = cookies;
        res.status.should.equal(302);
        res.headers.location.should.equal('/');
        done(err);
      });
  });

  it('should accept an invitation', function (done) {
    process.env.FORIM_INVITATION_IGNORE = 0;
    var req = http(app).get('/friend/ack');
    req.cookies = cookie3;
    req.query({
      token: token,
      email: user3.email,
      status: 'accept'
    });
    req.expect(200, function (err, res) {
      res.body.should.containDeepOrdered({
        code: 0, name: 'Success', message: '成功！'
      });
      done(err);
    });
  });

  it('should not acceptable more than once', function (done) {
    var req = http(app).get('/friend/ack').query({
      token: token,
      email: user3.email,
      status: 'accept'
    });
    req.cookies = cookie3;
    req.expect(200, function (err, res) {
      res.body.should.containDeepOrdered({
        code: 'MessageNotFound',
        message: '消息未找到！',
        name: 'MessageNotFound'
      });
      done(err);
    });
  });

  it('should not acceptable wrong email', function (done) {
    var req = http(app).get('/friend/ack').query({
      token: token,
      email: 'email@sdfsdf.com',
      status: 'accept'
    });
    req.cookies = cookie3;
    req.expect(200, function (err, res) {
      res.body.should.containDeepOrdered({
        code: 'EmailNotMatch',
        message: 'Email不匹配！',
        name: 'EmailNotMatch'
      });
      done(err);
    });
  });

  it('should add a friend not registerred', function (done) {
    process.env.FORIM_INVITATION_IGNORE = 0;
    var req = http(app).post('/friend/add');
    req.cookies = cookie2;
    req.send({
      email: user4.email
    }).expect(200, function (err, res) {
      res.body.should.containDeepOrdered({
        code: 0,
        name: 'Success',
        message: '成功！',
        data: {
          email: user4.email
        }
      });
      token = res.body.data.token;
      done(err);
    });
  });

  it('should not acceptable with other people', function (done) {
    process.env.FORIM_INVITATION_IGNORE = 0;
    var req = http(app).get('/friend/ack').query({
      token: token,
      email: user4.email,
      status: 'accept'
    });
    req.cookies = cookie1;
    req.expect(200, function (err, res) {
      res.body.should.containDeepOrdered({
        code: 'EmailNotMatch',
        message: 'Email不匹配！',
        name: 'EmailNotMatch'
      });
      done(err);
    });
  });

  it('should add a friend registerred', function (done) {
    process.env.FORIM_BY_PASS_POLICIES = 0;
    var req = http(app).post('/friend/add');
    req.cookies = cookie2;
    req.send({
      email: user3.email
    }).expect(200, function (err, res) {
      res.body.should.containDeepOrdered({
        code: 'FriendExists',
        message: '好友已经存在！',
        name: 'FriendExists'
      });
      done(err);
    });
  });

  it('should list friends', function (done) {
    process.env.FORIM_BY_PASS_POLICIES = 0;
    var req = http(app).get('/friend/list');
    req.cookies = cookie1;
    req.expect(200, function (err, res) {
      res.body.data.length.should.aboveOrEqual(1);
      for (var i = 0; i < res.body.data.length; i++) {
        shared.friend = res.body.data[i];
      }
      res.body.should.containDeepOrdered({
        code: 0,
        message: '成功！',
        name: 'Success'
      });
      done(err);
    });
  });

  it('should not remove friends with wrong id', function (done) {
    process.env.FORIM_BY_PASS_POLICIES = 0;
    var req = http(app).post('/friend/remove');
    req.cookies = cookie1;
    req.send({
      id: 'abcd'
    }).expect(200, function (err, res) {
      res.body.should.containDeepOrdered(
        {
          code: 33554437,
          message: '用户未找到！',
          name: 'UserNotFound'
        }
      );
      done(err);
    });
  });

  it('should remove friends', function (done) {
    process.env.FORIM_BY_PASS_POLICIES = 0;
    var req = http(app).post('/friend/remove');
    req.cookies = cookie1;
    req.send({
      id: shared.friend.friend.id
    }).expect(200, function (err, res) {
      res.body.should.containDeepOrdered({
        code: 0,
        message: '成功！',
        name: 'Success'
      });
      done(err);
    });
  });

  it('should not remove friends agagin', function (done) {
    process.env.FORIM_BY_PASS_POLICIES = 0;
    var req = http(app).post('/friend/remove');
    req.cookies = cookie1;
    req.send({
      id: shared.friend.friend.id
    }).expect(200, function (err, res) {
      res.body.should.containDeepOrdered({
        code: 'FriendNotFound',
        message: '好友未找到！',
        name: 'FriendNotFound'
      });
      done(err);
    });
  });

  it('should add a friend registerred', function (done) {
    process.env.FORIM_BY_PASS_POLICIES = 0;
    var Friend = app.models.Friend;
    Friend.destroy({}).exec(function () {
      var req = http(app).post('/friend/add');
      req.cookies = cookie1;
      req.send({
        email: user2.email
      }).expect(200, function (err, res) {
        res.body.should.containDeepOrdered({
          code: 0,
          data: {
            email: user2.email
          },
          message: '成功！',
          name: 'Success'
        });
        done(err);
      });
    });
  });

  it('should add a friend registerred', function (done) {
    var req = http(app).post('/friend/add');
    req.cookies = cookie1;
    req.send({
      email: user3.email
    }).expect(200, function (err, res) {
      res.body.should.containDeepOrdered({
        code: 0,
        data: {
          email: user3.email
        },
        message: '成功！',
        name: 'Success'
      });
      token = res.body.data.token;
      done(err);
    });
  });
  it('should accept an invitation', function (done) {
    process.env.FORIM_INVITATION_IGNORE = 1;
    var req = http(app).get('/friend/ack').query({
      token: token,
      email: user3.email,
      status: 'accept'
    });
    req.cookies = cookie3;
    req.expect(200, function (err, res) {
      res.body.should.containDeepOrdered({
        code: 0, name: 'Success', message: '成功！'
      });
      done(err);
    });
  });

  it('clear friends', function (done) {
    process.env.FORIM_BY_PASS_POLICIES = 0;
    var Friend = app.models.Friend;
    Friend.destroy({}).exec(function () {
      done();
    });
  });

  it('should add a friend registerred', function (done) {
    var req = http(app).post('/friend/add');
    req.cookies = cookie1;
    req.send({
      email: user2.email
    }).expect(200, function (err, res) {
      res.body.should.containDeepOrdered({
        code: 0,
        data: {
          email: user2.email
        },
        message: '成功！',
        name: 'Success'
      });
      token = res.body.data.token;
      done(err);
    });
  });

  it('should reject an invitation', function (done) {
    var req = http(app).get('/friend/ack').query({
      token: token,
      email: user2.email,
      status: 'reject'
    });
    req.cookies = cookie2;
    req.expect(200, function (err, res) {
      res.body.should.containDeepOrdered({
        code: 0,
        message: '成功！',
        name: 'Success'
      });
      done(err);
    });
  });
});
