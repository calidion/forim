var http = require('supertest');
var server = require('../app');
var app;
var shared = require('../shared');
var cookies;

describe('#new', function () {
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
  it('should 403 without session', function (done) {
    process.env.FORIM_BY_PASS_POLICIES = 0;
    var req = http(app);
    req.post('/message/new')
      .send({
        id: 1
      })
      .end(function (err, res) {
        res.statusCode.should.equal(403);
        res.text.should.containEql('Access Denied!');
        done(err);
      });
  });

  it('should create new message', function (done) {
    process.env.FORIM_BY_PASS_POLICIES = 0;
    var req = http(app).post('/message/new');
    req.cookies = shared.cookies;
    req
      .send({
        to: shared.id,
        text: 'hello world',
        time: new Date()
      })
      .expect(200)
      .end(function (err, res) {
        shared.message = res.body.data;
        res.body.should.containDeepOrdered({
          code: 0,
          message: '成功！',
          name: 'Success'
        });
        done(err);
      });
  });

  it('should create new message', function (done) {
    process.env.FORIM_BY_PASS_POLICIES = 0;
    var req = http(app).post('/message/new');
    req.cookies = shared.cookies;
    req
      .send({
        to: 'abc',
        text: 'hello world',
        time: new Date()
      })
      .expect(200)
      .end(function (err, res) {
        res.body.should.containDeepOrdered({
          code: 33554437, message: '用户未找到！',
          name: 'UserNotFound'
        });
        done(err);
      });
  });

  it('should create new message', function (done) {
    process.env.FORIM_BY_PASS_POLICIES = 0;

    var req = http(app).post('/message/new');
    req.cookies = shared.cookies;
    req
      .send({
        it: 'abc',
        text: 'hello world',
        time: new Date()
      })
      .expect(200)
      .end(function (err, res) {
        res.body.should.containDeepOrdered({
          code: 2,
          message: '输入无效!',
          name: 'InputInvalid'
        });
        done(err);
      });
  });
});
