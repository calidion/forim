var http = require('supertest');
var assert = require('assert');

var shared = require('../shared');
var server = require('../app');
var app;

describe('#list', function () {
  before(function (done) {
    server(function (data) {
      app = data;
      done();
    });
  });
  it('should get user list', function (done) {
    process.env.FORIM_BY_PASS_POLICIES = 1;
    var req = http(app);
    req.get('/user/list?limit=10&page=1')
      .end(function (error, res) {
        assert(!error);
        var body = res.body;
        assert(body.code === 0);
        var data = body.data;
        assert(data.total >= 0);
        assert(data.page >= 0);
        assert(data.count >= 0);
        assert(data.results.length >= 0);
        if (data.results.length >= 1) {
          shared.id = data.results[0].id;
        }
        done();
      });
  });
});
