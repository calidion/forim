var http = require('supertest');
var assert = require('assert');
var user = require('../../../lib/v2/routers/user');
var app = require('../../../lib/app');

describe('v2 users', function () {
  var id = 1;
  it('should allCallback', function (done) {
    var allCallback = user.allCallback;
    var res = {
      errorize: function (error, data) {
        assert(error === 'hood');
        assert(data.error);
        assert(data.data === undefined);
        done();
      },
      errors: {
        Failed: 'hood'
      }
    };
    var cb = allCallback(res);
    cb(true);
  });

  it('should failed', function (done) {
    var failed = user.failed;
    var res = {
      errorize: function (error, data) {
        assert(error === 'hood');
        assert(data);
        done();
      },
      errors: {
        Failed: 'hood'
      }
    };
    var cb = failed(res);
    cb(true);
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
        if (data.results.length >= 1) {
          id = data.results[0].id;
        }
        done();
      });
  });

  it('should get user info', function (done) {
    var req = http(app);
    req.get('/v2/users/' + id)
      .end(function (error, res) {
        assert(!error);
        var body = res.body;
        assert(body.code === 0);
        assert(body.data);
        done();
      });
  });

  it('should not get user', function (done) {
    var req = http(app);
    req.get('/v2/users/100000')
      .end(function (error, res) {
        assert(!error);
        var body = res.body;
        assert(body.name === 'NotFound');
        assert(!body.data);
        done();
      });
  });
});
