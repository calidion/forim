var express = require('../../../lib/app');
var request = require('supertest');
var assert = require('assert');
var cache = require('./cache');

describe('v2 weixin pages', function () {
  it('should be able to visit api', function (done) {
    var req = request(express)
      .get('/v2/settings/user?type=app');
    req.cookies = cache.cookes;
    req
      .expect(200)
      .end(function (err, res) {
        assert(!err);
        assert(res.text.indexOf('App基本设置') !== -1);
        done();
      });
  });

  it('should be able to visit api', function (done) {
    var req = request(express)
      .get('/v2/settings/user?type=message');
    req.cookies = cache.cookes;
    req
      .expect(200)
      .end(function (err, res) {
        assert(!err);

        assert(res.text.indexOf('消息设置') !== -1);
        done();
      });
  });

  it('should be able to visit api', function (done) {
    var req = request(express)
      .get('/v2/settings/user?type=oauth');
    req.cookies = cache.cookes;
    req
      .expect(200)
      .end(function (err, res) {
        assert(!err);

        assert(res.text.indexOf('OAuth设置') !== -1);
        done();
      });
  });

  it('should be able to visit api', function (done) {
    var req = request(express)
      .get('/v2/settings/user?type=urls');
    req.cookies = cache.cookes;
    req
      .expect(200)
      .end(function (err, res) {
        assert(!err);

        assert(res.text.indexOf('URLs设置') !== -1);
        done();
      });
  });

  it('should be able to visit api', function (done) {
    var req = request(express)
      .get('/v2/settings/user?type=server');
    req.cookies = cache.cookes;
    req
      .expect(200)
      .end(function (err, res) {
        assert(!err);

        assert(res.text.indexOf('服务器设置') !== -1);
        done();
      });
  });

  it('should be able to visit api', function (done) {
    var req = request(express)
      .get('/v2/settings/user?type=merchant');
    req.cookies = cache.cookes;
    req
      .expect(200)
      .end(function (err, res) {
        assert(!err);

        assert(res.text.indexOf('商家设置') !== -1);
        done();
      });
  });
  it('should be able to visit api', function (done) {
    var req = request(express)
      .get('/v2/settings/user?type=certificate');
    req.cookies = cache.cookes;
    req
      .expect(200)
      .end(function (err, res) {
        assert(!err);
        assert(res.text.indexOf('支付证书设置') !== -1);
        done();
      });
  });

  it('should be able to visit api', function (done) {
    var req = request(express)
      .get('/v2/settings/user?type=ttt');
    req.cookies = cache.cookes;
    req
      .expect(200)
      .end(function (err, res) {
        assert(!err);
        assert(res.text.indexOf('App基本设置') !== -1);
        done();
      });
  });
});
