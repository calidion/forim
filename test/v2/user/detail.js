var http = require('supertest');
var assert = require('assert');

var shared = require('../shared');
var server = require('../app');
var app;

describe('#detail', function () {
  before(function (done) {
    server(function (data) {
      app = data;
      done();
    });
  });
  it('should get user info', function (done) {
    process.env.FORIM_BY_PASS_POLICIES = 1;
    var req = http(app);
    req.get('/user/detail/' + shared.id)
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
    req.get('/user/detail/100000')
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
    req.get('/user/detail/100000')
      .expect(403)
      .end(done);
  });
});
