var http = require('supertest');
var server = require('../app');
var app;
var shared = require('../shared');

describe('#list', function () {
  before(function (done) {
    server(function (data) {
      app = data;
      done();
    });
  });
  it('should login in successful', function (done) {
    var req = http(app);
    req.post('/user/login')
      .send(shared.user)
      .end(function (err, res) {
        var re = new RegExp('; path=/; httponly', 'gi');
        var cookies = res.headers['set-cookie']
          .map(function (r) {
            return r.replace(re, '');
          }).join('; ');
        shared.cookies = cookies;
        res.status.should.equal(302);
        res.headers.location.should.equal('/');
        done(err);
      });
  });
  it('should 403 without session', function (done) {
    process.env.FORIM_BY_PASS_POLICIES = 0;
    var req = http(app);
    req.get('/message/list')
      .query({
        id: shared.friend.friend.id
      })
      .end(function (err, res) {
        res.statusCode.should.equal(403);
        res.text.should.containEql('Access Denied!');
        done(err);
      });
  });

  it('should get message list', function (done) {
    process.env.FORIM_BY_PASS_POLICIES = 0;
    var req = http(app).get('/message/list');
    req.cookies = shared.cookies;
    req
      .query({
        id: shared.friend.friend.id,
        page: 0
      })
      .end(function (err, res) {
        res.statusCode.should.equal(200);
        res.body.data.length.should.aboveOrEqual(1);
        shared.messages = res.body.data;
        res.body.should.containDeepOrdered({
          code: 0,
          message: '成功！',
          name: 'Success'
        });
        done(err);
      });
  });

  it('should get message list', function (done) {
    process.env.FORIM_BY_PASS_POLICIES = 0;
    var req = http(app).get('/message/list');
    req.cookies = shared.cookies;
    req
      .query({
        id: shared.friend.friend.id,
        page: 0,
        unread: true
      })
      .end(function (err, res) {
        res.statusCode.should.equal(200);
        res.body.data.length.should.aboveOrEqual(1);
        shared.messages = res.body.data;
        res.body.should.containDeepOrdered({
          code: 0,
          message: '成功！',
          name: 'Success'
        });
        done(err);
      });
  });

  it('should get error when with wrong params', function (done) {
    process.env.FORIM_BY_PASS_POLICIES = 0;
    var req = http(app).get('/message/list');
    req.cookies = shared.cookies;
    req
      .query({
        id: shared.friend.friend.id,
        limit: 'sdfsdf'
      })
      .end(function (err, res) {
        res.statusCode.should.equal(200);
        console.log(err, res.text);
        res.body.should.containDeepOrdered({
          code: 2,
          name: 'InputInvalid',
          message: '输入无效!'
        });
        done(err);
      });
  });
});
