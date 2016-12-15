var http = require('supertest');
var assert = require('assert');
var server = require('../app');
var app;

describe('#profile', function () {
  before(function (done) {
    server(function (data) {
      app = data;
      done();
    });
  });

  it('should not get user profile', function (done) {
    process.env.FORIM_BY_PASS_POLICIES = 0;
    var req = http(app);
    req.get('/user/profile')
      .end(function (error, res) {
        assert(!error);
        var body = res.body;
        assert(body.code === 1);
        done();
      });
  });
  it('should get user profile', function (done) {
    process.env.FORIM_BY_PASS_POLICIES = 1;
    process.env.FORIM_MOCK_USER = 1;
    var req = http(app);
    req.get('/user/profile')
      .end(function (error, res) {
        assert(!error);
        var body = res.body;
        assert(body.code === 0);
        assert(body.data);
        done();
      });
  });
});
