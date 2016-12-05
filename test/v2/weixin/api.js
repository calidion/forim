var request = require('supertest');
var cache = require('./cache');
var server = require('../app');
var express;

describe('v2 weixin api', function () {
  before(function (done) {
    server(function (data) {
      express = data;
      done();
    });
  });
  it('should be able to visit api', function (done) {
    request(express)
      .get('/weixin/api/' + cache.id + '/auth/ack')
      .expect(200)
      .end(done);
  });
});
