var http = require('supertest');
var assert = require('assert');
var app = require('../../../lib/app');
var v2 = require('../../../lib/v2');
var config = require('../../../lib/config');

describe('v2 users', function () {
  it('should init waterline', function (done) {
    v2(config.waterline, app, function (error, ontology) {
      assert(!error);
      assert(ontology.collections.user);
      done();
    });
  });

  it('should get user list', function (done) {
    var req = http(app);
    req.get('/v2/users?limit=10&page=1')
      .end(function (error, res) {
        assert(!error);
        var body = res.body;
        assert(body.code === 0);
        var data = body.data;
        assert(data.total >= 0);
        assert(data.page >= 0);
        assert(data.count >= 0);
        assert(data.results.length >= 0);
        done();
      });
  });

  it('should get user 1', function (done) {
    var req = http(app);
    req.get('/v2/users/1')
      .end(function (error, res) {
        assert(!error);
        var body = res.body;
        console.log(body);
        done();
      });
  });
});
