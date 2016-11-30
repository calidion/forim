var http = require('supertest');
var assert = require('assert');
var server = require('./app');
var app;
var shared = require('./shared');

describe('v2 password', function () {
  before(function (done) {
    server(function (data) {
      app = data;
      done();
    });
  });

  it('should update password', function (done) {
    process.env.FORIM_BY_PASS_POLICIES = 0;
    var req = http(app).post('/password/update');
    var password = 'sdfsdfodf';
    req.cookies = shared.cookies;
    req
      .send({
        old: shared.user.password,
        new: password,
        confirm: password
      })
      .expect(200)
      .end(function (err, res) {
        shared.user.password = password;
        res.text.should.containEql('你的密码修改成功。');
        done(err);
      });
  });
});
