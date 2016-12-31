var http = require('supertest');
var shared = require('../shared');
var server = require('../app');
var app;
var token;

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

  it('should add a friend not registerred', function (done) {
    process.env.FORIM_BY_PASS_POLICIES = 0;
    var req = http(app).post('/friend/add');
    req.cookies = shared.cookies;
    req.send({
      email: 'abc@sdfsfdf.com'
    }).expect(200, function (err, res) {
      res.body.should.containDeepOrdered({
        code: 0,
        name: 'Success',
        message: '成功！',
        data: {
          email: 'abc@sdfsfdf.com'
        }
      });
      token = res.body.data.token;
      done(err);
    });
  });

  it('should accept an invitation', function (done) {
    process.env.FORIM_INVITATION_IGNORE = 0;
    var req = http(app).get('/friend/ack').query({
      token: token,
      email: 'abc1@sdfsfdf.com',
      status: 'accept'
    });
    req.cookies = shared.cookies;
    req.expect(302, function (err) {
      done(err);
    });
  });

  it('should add a friend not registerred', function (done) {
    process.env.FORIM_BY_PASS_POLICIES = 0;
    var req = http(app).post('/friend/add');
    req.cookies = shared.cookies;
    req.send({
      email: 'abcc@sdfsfdf.com'
    }).expect(200, function (err, res) {
      res.body.should.containDeepOrdered({
        code: 0,
        name: 'Success',
        message: '成功！',
        data: {
          email: 'abcc@sdfsfdf.com'
        }
      });
      token = res.body.data.token;
      done(err);
    });
  });

  it('should reject an invitation', function (done) {
    process.env.FORIM_INVITATION_IGNORE = 1;
    var req = http(app).get('/friend/ack').query({
      token: token,
      email: 'abcc@sdfsfdf.com',
      status: 'reject'
    });
    req.cookies = shared.cookies;
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
    req.cookies = shared.cookies;
    req.send({
      email: shared.user.email
    }).expect(200, function (err, res) {
      res.body.should.containDeepOrdered({
        code: 0,
        name: 'Success',
        message: '成功！',
        data: {
          email: shared.user.email
        }
      });
      token = res.body.data.token;
      done(err);
    });
  });
  it('should accept an invitation', function (done) {
    process.env.FORIM_INVITATION_IGNORE = 1;
    var req = http(app).get('/friend/ack').query({
      token: token,
      email: shared.user.email,
      status: 'accept'
    });
    req.cookies = shared.cookies;
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
      email: shared.user.email,
      status: 'accept'
    });
    req.cookies = shared.cookies;
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
    req.cookies = shared.cookies;
    req.expect(200, function (err, res) {
      res.body.should.containDeepOrdered({
        code: 'MessageNotFound',
        name: 'MessageNotFound',
        message: '消息未找到！'
      });
      done(err);
    });
  });
  it('should not acceptable with other people', function (done) {
    process.env.FORIM_INVITATION_IGNORE = 0;
    var req = http(app).get('/friend/ack').query({
      token: token,
      email: shared.user.email,
      status: 'accept'

    });
    req.cookies = shared.cookies;
    req.expect(200, function (err, res) {
      res.body.should.containDeepOrdered({
        code: 'MessageNotFound',
        name: 'MessageNotFound',
        message: '消息未找到！'
      });
      done(err);
    });
  });

  it('should add a friend registerred', function (done) {
    process.env.FORIM_BY_PASS_POLICIES = 0;
    var req = http(app).post('/friend/add');
    req.cookies = shared.cookies;
    req.send({
      email: shared.user.email
    }).expect(200, function (err, res) {
      res.body.should.containDeepOrdered({
        code: 'FriendExists',
        message: '好友已经存在！',
        name: 'FriendExists'
      });
      done(err);
    });
  });

  it('should add a friend registerred', function (done) {
    process.env.FORIM_BY_PASS_POLICIES = 0;
    var Friend = app.models.Friend;
    Friend.destroy({}).exec(function () {
      var req = http(app).post('/friend/add');
      req.cookies = shared.cookies;
      req.send({
        email: shared.user.email
      }).expect(200, function (err, res) {
        res.body.should.containDeepOrdered({
          code: 0,
          data: {
            email: shared.user.email
          },
          message: '成功！',
          name: 'Success'
        });
        done(err);
      });
    });
  });
});
