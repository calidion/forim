// var express = require('../../../lib/app');
var request = require('supertest');
var assert = require('assert');
var path = require('path');
var fs = require('fs');
var cache = require('./cache');
var shared = require('../shared');

var filePath = path.resolve(__dirname, './fixtures/cert.p12');
var server = require('../app');
var express;

describe('v2 weixin settings', function () {
  var cookies;
  before(function (done) {
    server(function (data) {
      express = data;
      done();
    });
  });
  it('should set app config', function (done) {
    cookies = shared.cookies;
    var req = request(express)
      .post('/weixin/config/app');
    req.cookies = cookies;
    req
      .send({
        id: '1',
        token: 'token',
        secret: 'secret'
      })
      .expect(200)
      .end(function (error, res) {
        assert.equal(true, !error);
        assert.deepEqual({
          code: 0,
          name: 'Success',
          message: '成功！',
          data: {
            id: '1',
            secret: 'secret',
            token: 'token'
          }
        }, res.body);

        done();
      });
  });

  it('should get app config', function (done) {
    var req = request(express)
      .get('/weixin/config/app');
    req.cookies = cookies;

    req.expect(200)
      .end(function (error, res) {
        assert.equal(true, !error);
        assert.deepEqual({
          code: 0,
          name: 'Success',
          message: '成功！',
          data: {
            id: '1',
            secret: 'secret',
            token: 'token'
          }
        }, res.body);
        done();
      });
  });

  it('should set oauth config', function (done) {
    var req = request(express)
      .post('/weixin/config/oauth');
    req.cookies = cookies;
    req.send({
      state: 'state',
      scope: 0
    }).expect(200)
      .end(function (error, res) {
        assert.equal(true, !error);

        assert.equal(true, res.body.data.state === 'state');
        assert.equal(true, res.body.data.scope === 0);
        done();
      });
  });

  it('should get oauth config', function (done) {
    var req = request(express)
      .get('/weixin/config/oauth');
    req.cookies = cookies;
    req.expect(200)
      .end(function (error, res) {
        assert.equal(true, !error);
        assert.equal(true, res.body.data !== null);
        assert.equal(true, res.body.data.state === 'state');
        assert.equal(true, res.body.data.scope === 0);
        done();
      });
  });

  it('should set merchant config', function (done) {
    var req = request(express)
      .post('/weixin/config/merchant');
    req.cookies = cookies;
    req.send({
      id: 'id',
      key: 'key'
    })
      .expect(200)
      .end(function (error, res) {
        assert.equal(true, !error);
        assert.deepEqual({
          code: 0,
          name: 'Success',
          message: '成功！',
          data: {
            id: 'id',
            key: 'key'
          }
        }, res.body);
        done();
      });
  });
  it('should get merchant config', function (done) {
    var req = request(express)
      .get('/weixin/config/merchant');
    req.cookies = cookies;
    req
      .expect(200)
      .end(function (error, res) {
        assert.equal(true, !error);

        assert.deepEqual({
          code: 0,
          name: 'Success',
          message: '成功！',
          data: {
            id: 'id',
            key: 'key'
          }
        }, res.body);
        done();
      });
  });

  it('should set message config', function (done) {
    var req = request(express)
      .post('/weixin/config/message');
    req.cookies = cookies;
    req
      .send({
        aes: 'aes'
      })
      .expect(200)
      .end(function (error, res) {
        assert.equal(true, !error);

        assert.deepEqual({
          code: 0,
          name: 'Success',
          message: '成功！',
          data: {
            aes: 'aes'
          }
        }, res.body);
        done();
      });
  });

  it('should get message config', function (done) {
    var req = request(express)
      .get('/weixin/config/message');
    req.cookies = cookies;
    req
      .expect(200)
      .end(function (error, res) {
        assert.equal(true, !error);

        assert.deepEqual({
          code: 0,
          name: 'Success',
          message: '成功！',
          data: {
            aes: 'aes'
          }
        }, res.body);
        done();
      });
  });

  it('should set server config', function (done) {
    var req = request(express)
      .post('/weixin/config/server');
    req.cookies = cookies;
    req
      .send({
        host: 'localhost',
        prefix: 'weixin'
      })
      .expect(200)
      .end(function (error, res) {
        assert.equal(true, !error);

        assert.deepEqual({
          code: 0,
          name: 'Success',
          message: '成功！',
          data: {
            host: 'localhost',
            prefix: 'weixin'
          }
        }, res.body);
        done();
      });
  });

  it('should get server config', function (done) {
    var req = request(express)
      .get('/weixin/config/server');
    req.cookies = cookies;
    req
      .expect(200)
      .end(function (error, res) {
        assert.equal(true, !error);

        assert.deepEqual({
          code: 0,
          name: 'Success',
          message: '成功！',
          data: {
            host: 'localhost',
            prefix: 'weixin'
          }
        }, res.body);
        done();
      });
  });

  it('should set urls config', function (done) {
    var req = request(express)
      .post('/weixin/config/urls');
    req.cookies = cookies;
    req
      .send({
        url: 'http://localhost/weixin'
      })
      .expect(200)
      .end(function (error, res) {
        assert.equal(true, !error);

        assert.deepEqual({
          code: 0,
          name: 'Success',
          message: '成功！',
          data: {
            base: {
              url: 'http://localhost/weixin'
            },
            auth: {
              ack: 'http://localhost/weixin/auth/ack'
            },
            jssdk: {
              config: 'http://localhost/weixin/jssdk/config'
            },
            oauth: {
              access: 'http://localhost/weixin/oauth/access',
              success: 'http://localhost/weixin/oauth/success'
            },
            pay: {
              callback: 'http://localhost/weixin/pay/callback'
            }
          }
        }, res.body);
        done();
      });
  });

  it('should get urls config', function (done) {
    var req = request(express)
      .get('/weixin/config/urls');
    req.cookies = cookies;
    req
      .expect(200)
      .end(function (error, res) {
        assert.equal(true, !error);

        assert.deepEqual({
          code: 0,
          name: 'Success',
          message: '成功！',
          data: {
            base: {
              url: 'http://localhost/weixin'
            },
            auth: {
              ack: 'http://localhost/weixin/auth/ack'
            },
            jssdk: {
              config: 'http://localhost/weixin/jssdk/config'
            },
            oauth: {
              access: 'http://localhost/weixin/oauth/access',
              success: 'http://localhost/weixin/oauth/success'
            },
            pay: {
              callback: 'http://localhost/weixin/pay/callback'
            }
          }
        }, res.body);
        done();
      });
  });

  it('should set certificate without pfx', function (done) {
    var req = request(express)
      .post('/weixin/config/certificate');
    req.cookies = cookies;
    req
      .field('pfxKey', 'key')
      .expect(200)
      .end(function (error, res) {
        // var content = fs.readFileSync(__dirname + '/fixtures/cert.p12');
        assert.equal(true, !error);

        assert.deepEqual({
          code: 0,
          name: 'Success',
          message: '成功！',
          data: {
            pfxKey: 'key',
            pfx: null
          }
        }, res.body);
        done();
      });
  });

  it('should set certificate config', function (done) {
    var req = request(express)
      .post('/weixin/config/certificate');
    req.cookies = cookies;
    req
      .field('pfxKey', 'key')
      .attach('pfx', filePath)
      .expect(200)
      .end(function (error, res) {
        var content = fs.readFileSync(filePath);
        assert.equal(true, !error);

        assert.deepEqual({
          code: 0,
          name: 'Success',
          message: '成功！',
          data: {
            pfxKey: 'key',
            pfx: content.toString('base64')
          }
        }, res.body);
        done();
      });
  });

  it('should get certificate config', function (done) {
    var req = request(express)
      .get('/weixin/config/certificate');
    req.cookies = cookies;
    req
      .expect(200)
      .end(function (error, res) {
        var content = fs.readFileSync(filePath);
        assert.equal(true, !error);

        assert.deepEqual({
          code: 0,
          name: 'Success',
          message: '成功！',
          data: {
            pfxKey: 'key',
            pfx: content.toString('base64')
          }
        }, res.body);
        done();
      });
  });

  it('should get setting id', function (done) {
    var req = request(express).post('/v2/weixin/settings/user');
    req.cookies = cookies;
    req.field('action', 'id')
      .end(function (error, res) {
        assert(!error);
        var body = res.body;
        cache.id = body.data.id;
        assert(body.code === 0);
        assert(cache.id);
        done();
      });
  });
});
