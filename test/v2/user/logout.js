var http = require('supertest');
var server = require('../app');
var app;

describe('v2 user#logout', function () {
  before(function (done) {
    server(function (data) {
      app = data;
      done();
    });
  });
  it('should logout', function (done) {
    var req = http(app);
    req.get('/user/logout')
      .expect(302)
      .end(done);
  });

  it('should logout', function (done) {
    var req = http(app);
    req.post('/user/logout')
      .expect(302)
      .end(done);
  });
});
