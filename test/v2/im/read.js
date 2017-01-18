var http = require('supertest');
var server = require('../app');
var app;
var shared = require('../shared');

describe('#read', function () {
  before(function (done) {
    server(function (data) {
      app = data;
      done();
    });
  });
  it('should 403 without session', function (done) {
    process.env.FORIM_BY_PASS_POLICIES = 0;
    var req = http(app);
    req.post('/message/read')
      .send({
        id: 'sdfsfo'
      })
      .end(function (err, res) {
        res.statusCode.should.equal(403);
        res.text.should.containEql('Access Denied!');
        done(err);
      });
  });

  it('should update a message', function (done) {
    process.env.FORIM_BY_PASS_POLICIES = 0;
    var req = http(app).post('/message/read');
    req.cookies = shared.cookies;

    req
      .send({
        id: shared.messages[0].id
      })
      .expect(200)
      .end(function (err, res) {
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
    var req = http(app).post('/message/read');
    req.cookies = shared.cookies;
    req
      .send({
        id: 'abc',
        text: 'hello world'
      })
      .expect(200)
      .end(function (err, res) {
        res.body.should.containDeepOrdered({
          code: 'MessageNotFound',
          message: '消息未找到！',
          name: 'MessageNotFound'
        });
        done(err);
      });
  });

  it('should create new message', function (done) {
    process.env.FORIM_BY_PASS_POLICIES = 0;

    var req = http(app).post('/message/read');
    req.cookies = shared.cookies;
    req
      .send({
        it: 'abc',
        text: 'hello world'
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
