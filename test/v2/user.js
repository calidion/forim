var http = require('supertest');
var assert = require('assert');
var shared = require('./shared');
var server = require('./app');
var app;

describe('v2 user', function () {

  before(function (done) {
    server(function (data) {
      app = data;
      done();
    });
  });

  require('./user/register');
  require('./user/login');
  require('./user/activate');
  require('./user/settings');
  require('./user/logout');
  require('./user/password');
  require('./user/page');
  require('./user/list');

  describe('#main', function () {

    it('should not able to lock a user', function (done) {
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
    it('should get /user/top', function (done) {
      var req = http(app);
      req.get('/user/top')
        .expect(200, function (err, res) {
          res.text.should.containEql('Top100 积分榜');
          done(err);
        });
    });

    it('should clear a user', function (done) {
      var req = http(app);
      req.post('/user/clear')
        .send({
          username: shared.user.username
        })
        .expect(200, function (err, res) {
          res.body.status.should.eql('success');
          done(err);
        });
    });
  });
});
