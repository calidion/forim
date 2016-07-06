var express = require('../../../lib/app');
var request = require('supertest');
var cache = require('./cache');

describe('v2 weixin api', function () {
  it('should be able to visit api', function (done) {
    request(express)
      .get('/weixin/api/' + cache.id + '/auth/ack')
      .expect(200)
      .end(done);
  });
});
