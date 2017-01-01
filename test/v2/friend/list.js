var http = require('supertest');
var shared = require('../shared');
var server = require('../app');
var app;

describe('friend#list', function () {
  before(function (done) {
    server(function (data) {
      app = data;
      done();
    });
  });

  it('should list friends', function (done) {
    process.env.FORIM_BY_PASS_POLICIES = 0;
    var req = http(app).get('/friend/list');
    req.cookies = shared.cookies;
    req.expect(200, function (err, res) {
      res.body.should.containDeepOrdered({
        code: 0,
        message: '成功！',
        name: 'Success'
      });
      done(err);
    });
  });
});
