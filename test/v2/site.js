var http = require('supertest');
// var assert = require('assert');
var server = require('./app');
var app;
var shared = require('./shared');

describe('v2 site', function () {
  before(function (done) {
    server(function (data) {
      app = data;
      done();
    });
  });
  it('should get /', function (done) {
    var req = http(app).get('/');
    req
      .expect(200)
      .end(function (err, res) {
        res.status.should.equal(200);
        res.text.should.containEql('积分榜');
        done(err);
      });
  });

  it('should get / with page', function (done) {
    var req = http(app).get('/').query({
      page: 10
    });
    req
      .expect(200)
      .end(function (err, res) {
        res.status.should.equal(200);
        res.text.should.containEql('积分榜');
        done(err);
      });
  });
});
