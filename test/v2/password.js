var http = require('supertest');
var server = require('./app');
var app;
var shared = require('./shared');
var cookies;

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

  it('should login in successfully again', function (done) {
    var req = http(app);
    req.post('/user/login')
      .send({
        username: shared.user.username,
        password: shared.user.password
      })
      .end(function (err, res) {
        var re = new RegExp('; path=/; httponly', 'gi');
        cookies = res.headers['set-cookie']
          .map(function (r) {
            return r.replace(re, '');
          }).join("; ");
        shared.cookies = cookies;
        res.status.should.equal(302);
        res.headers.location.should.equal('/');
        done(err);
      });
  });
});
