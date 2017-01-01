var http = require('supertest');
var shared = require('../shared');
var server = require('../app');
var app;

describe('friend#block', function () {
  before(function (done) {
    server(function (data) {
      app = data;
      done();
    });
  });
  it('should block a user', function (done) {
    process.env.FORIM_BY_PASS_POLICIES = 0;
    var req = http(app).post('/friend/block');
    req.cookies = shared.cookies;
    req.send({
    }).expect(403, function (err) {
      done(err);
    });
  });
  it('should block a user', function (done) {
    process.env.FORIM_BY_PASS_POLICIES = 0;
    var req = http(app).post('/friend/block');
    req.cookies = shared.cookies;
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
  it('should not find a user', function (done) {
    process.env.FORIM_BY_PASS_POLICIES = 0;
    var req = http(app).post('/friend/block');
    req.cookies = shared.cookies;
    req.send({
      id: shared.friend.id
    }).expect(200, function (err, res) {
      res.body.should.containDeepOrdered({
        code: 33554437,
        message: '用户未找到！',
        name: 'UserNotFound'
      });
      done(err);
    });
  });
});
