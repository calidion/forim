var http = require('supertest');
var shared = require('../shared');
var server = require('../app');
var app;

describe('#block', function () {
  before(function (done) {
    server(function (data) {
      app = data;
      done();
    });
  });
  it('should not able to block a user', function (done) {
    process.env.FORIM_BY_PASS_POLICIES = 0;
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
  it('should block a user', function (done) {
    process.env.FORIM_BY_PASS_POLICIES = 1;
    var req = http(app);
    req.post('/user/block')
      .send({
        username: shared.user.username
      })
      .expect(200, function (err, res) {
        res.body.blocked.should.eql(true);
        done(err);
      });
  });
  it('should unblock a user', function (done) {
    var req = http(app);
    req.post('/user/block')
      .send({
        username: shared.user.username
      })
      .expect(200, function (err, res) {
        res.body.blocked.should.eql(false);
        done(err);
      });
  });

  it('should not unblock a user not existed', function (done) {
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
});
