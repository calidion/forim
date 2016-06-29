var http = require('supertest');
var assert = require('assert');
var settings = require('../../../lib/v2/routers/settings');
var app = require('../../../lib/app');

describe('v2 settings', function () {
  var id = 1;
  it('should allCallback', function (done) {
    var allCallback = settings.allCallback;
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
    var failed = settings.failed;
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

  it('should get settings list', function (done) {
    process.env.FORIM_BY_PASS_POLICIES = 1;
    var req = http(app);
    req.get('/v2/settings?limit=10&page=1')
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

  // it('should get settings info', function (done) {
  //   process.env.FORIM_BY_PASS_POLICIES = 1;
  //   var req = http(app);
  //   req.get('/v2/settings/' + id)
  //     .end(function (error, res) {
  //       assert(!error);
  //       var body = res.body;
  //       assert(body.code === 0);
  //       assert(body.data);
  //       done();
  //     });
  // });

  // it('should get settings info', function (done) {
  //   process.env.FORIM_BY_PASS_POLICIES = 1;
  //   var req = http(app);
  //   req.get('/v2/settings/' + id)
  //     .end(function (error, res) {
  //       assert(!error);
  //       var body = res.body;
  //       assert(body.code === 0);
  //       assert(body.data);
  //       done();
  //     });
  // });


  it('should not get settings', function (done) {
    process.env.FORIM_BY_PASS_POLICIES = 1;
    var req = http(app);
    req.get('/v2/settings/100000')
      .end(function (error, res) {
        assert(!error);
        var body = res.body;
        assert(body.name === 'NotFound');
        assert(!body.data);
        done();
      });
  });

  it('should get 404', function (done) {
    process.env.FORIM_BY_PASS_POLICIES = 0;
    var req = http(app);
    req.get('/v2/settings/100000')
      .expect(404)
      .end(done);
  });
});
