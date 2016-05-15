var request = require('supertest');
var app = require('../lib/app');
var config = require('../lib/config');

var assert = require('assert');

describe('test/app.test.js', function () {
  it('should / status 200', function (done) {
    request(app).get('/').end(function (err, res) {
      assert.equal(true, res.status === 200);
      assert.equal(true, res.text.indexOf(config.description) !== -1);
      done();
    });
  });
});
