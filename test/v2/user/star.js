var http = require('supertest');
var shared = require('../shared');
var server = require('../app');
var app;

describe('#starring', function () {
  before(function (done) {
    server(function (data) {
      app = data;
      done();
    });
  });
  it('should star a user', function (done) {
    var req = http(app);
    req.post('/user/star')
      .send({
        username: shared.user.username
      })
      .expect(200, function (err, res) {
        res.body.starred.should.eql(true);
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
        res.body.starred.should.eql(false);
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
