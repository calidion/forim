/*!
 * nodeclub - site controller test
 * Copyright(c) 2012 fengmk2 <fengmk2@gmail.com>
 * MIT Licensed
 */

/**
 * Module dependencies.
 */

var should = require('should');
var config = require('../../lib/config');
var app = require('../../lib/app');
var request = require('supertest')(app);


describe('test/controllers/site.test.js', function () {

  it('should /sitemap.xml 200', function (done) {
    request.get('/sitemap.xml')
    .expect(200, function (err, res) {
      res.text.should.containEql('<url>');
      done(err);
    });
  });
});
