var http = require('supertest');
var server = require('../app');
var app;
var shared = require('../shared');
var cookies;

describe('#my', function () {
  before(function (done) {
    server(function (data) {
      app = data;
      done();
    });
  });
  it('should login in successful', function (done) {
    var req = http(app);
    req.post('/user/login')
      .send(shared.user)
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
  it('should 403 without session', function (done) {
    process.env.FORIM_BY_PASS_POLICIES = 0;
    var req = http(app);
    req.get('/my/messages')
      .end(function (err, res) {
        res.statusCode.should.equal(403);
        res.text.should.containEql('Access Denied!');
        done(err);
      });
  });

  it('should get my messages', function (done) {
    var req = http(app).get('/my/messages');
    req.cookies = shared.cookies;
    req
      .expect(200)
      .end(function (err, res) {
        res.text.should.containEql('新消息');
        done(err);
      });
  });
});
