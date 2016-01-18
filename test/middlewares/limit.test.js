var limitMiddleware = require('../../middlewares/limit');
var app = require('../../app');
var supertest;
var support = require('../support/support');
var pedding = require('pedding');
var visitor = 'visit' + Date.now();

describe('test/middlewares/limit.test.js', function () {
  before(function (done) {
    support.ready(done);
  });
});
