var http = require('supertest');
var assert = require('assert');
var shared = require('../shared');
var server = require('../app');
var app;

describe('v2 user#logout', function () {
  var username = shared.user.username;
  var email = shared.user.email;
  var password = shared.user.password;
  var id = 1;
  var cookies;

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