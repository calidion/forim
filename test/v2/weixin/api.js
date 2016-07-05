var express = require('../../../lib/app');
var request = require('supertest');
describe('v2 weixin api', function () {
  it('should be able to visit api', function (done) {
    request(express)
      .get('/weixin/api/auth/ack')
      .expect(200)
      .end(done);
  });
});
