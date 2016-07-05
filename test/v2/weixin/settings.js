var express = require('../../../lib/app');
var request = require('supertest');
var assert = require('assert');
var path = require('path');
var fs = require('fs');

var filePath = path.resolve(__dirname, './fixtures/cert.p12');

describe('v2 weixin', function () {
  it('should set app config', function (done) {
    request(express)
      .post('/weixin/config/app')
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
          data: { id: '1', secret: 'secret', token: 'token' }
        }, res.body);

        done();
      });
  });

  it('should get app config', function (done) {
    request(express)
      .get('/weixin/config/app')
      .expect(200)
      .end(function (error, res) {
        assert.equal(true, !error);
        assert.deepEqual({
          code: 0,
          name: 'Success',
          message: '成功！',
          data: { id: '1', secret: 'secret', token: 'token' }
        }, res.body);
        done();
      });
  });

  it('should set oauth config', function (done) {
    request(express)
      .post('/weixin/config/oauth')
      .send({
        state: 'state',
        scope: 0
      })
      .expect(200)
      .end(function (error, res) {
        assert.equal(true, !error);
        console.log(res.body);
        assert.equal(true, res.body.data.state === 'state');
        assert.equal(true, res.body.data.scope === 0);
        done();
      });
  });

  it('should get oauth config', function (done) {
    request(express)
      .get('/weixin/config/oauth')
      .expect(200)
      .end(function (error, res) {
        assert.equal(true, !error);
        console.log(res.body);
        assert.equal(true, res.body.data !== null);
        assert.equal(true, res.body.data.state === 'state');
        assert.equal(true, res.body.data.scope === 0);
        done();
      });
  });


  it('should set merchant config', function (done) {
    request(express)
      .post('/weixin/config/merchant')
      .send({
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
          data: { id: 'id', key: 'key' }
        }, res.body);
        done();
      });
  });
  it('should get merchant config', function (done) {
    request(express)
      .get('/weixin/config/merchant')
      .expect(200)
      .end(function (error, res) {
        assert.equal(true, !error);
        console.log(res.body);
        assert.deepEqual({
          code: 0,
          name: 'Success',
          message: '成功！',
          data: { id: 'id', key: 'key' }
        }, res.body);
        done();
      });
  });

  it('should set message config', function (done) {
    request(express)
      .post('/weixin/config/message')
      .send({
        aes: 'aes'
      })
      .expect(200)
      .end(function (error, res) {
        assert.equal(true, !error);
        console.log(res.body);
        assert.deepEqual({
          code: 0,
          name: 'Success',
          message: '成功！',
          data: { aes: 'aes' }
        }, res.body);
        done();
      });
  });

  it('should get message config', function (done) {
    request(express)
      .get('/weixin/config/message')
      .expect(200)
      .end(function (error, res) {
        assert.equal(true, !error);
        console.log(res.body);
        assert.deepEqual({
          code: 0,
          name: 'Success',
          message: '成功！',
          data: { aes: 'aes' }
        }, res.body);
        done();
      });
  });

  it('should set server config', function (done) {
    request(express)
      .post('/weixin/config/server')
      .send({
        host: 'localhost',
        prefix: 'weixin'
      })
      .expect(200)
      .end(function (error, res) {
        assert.equal(true, !error);
        console.log(res.body);
        assert.deepEqual({
          code: 0,
          name: 'Success',
          message: '成功！',
          data: { host: 'localhost', prefix: 'weixin' }
        }, res.body);
        done();
      });
  });

  it('should get server config', function (done) {
    request(express)
      .get('/weixin/config/server')
      .expect(200)
      .end(function (error, res) {
        assert.equal(true, !error);
        console.log(res.body);
        assert.deepEqual({
          code: 0,
          name: 'Success',
          message: '成功！',
          data: { host: 'localhost', prefix: 'weixin' }
        }, res.body);
        done();
      });
  });

  it('should set urls config', function (done) {
    request(express)
      .post('/weixin/config/urls')
      .send({
        url: 'http://localhost/weixin'
      })
      .expect(200)
      .end(function (error, res) {
        assert.equal(true, !error);
        console.log(res.body);
        assert.deepEqual({
          code: 0,
          name: 'Success',
          message: '成功！',
          data: {
            base: { url: 'http://localhost/weixin' },
            auth: { ack: 'http://localhost/weixin/auth/ack' },
            jssdk: { config: 'http://localhost/weixin/jssdk/config' },
            oauth:
            {
              access: 'http://localhost/weixin/oauth/access',
              success: 'http://localhost/weixin/oauth/success'
            },
            pay: { callback: 'http://localhost/weixin/pay/callback' }
          }
        }, res.body);
        done();
      });
  });

  it('should get urls config', function (done) {
    request(express)
      .get('/weixin/config/urls')
      .expect(200)
      .end(function (error, res) {
        assert.equal(true, !error);
        console.log(res.body);
        assert.deepEqual({
          code: 0,
          name: 'Success',
          message: '成功！',
          data: {
            base: { url: 'http://localhost/weixin' },
            auth: { ack: 'http://localhost/weixin/auth/ack' },
            jssdk: { config: 'http://localhost/weixin/jssdk/config' },
            oauth:
            {
              access: 'http://localhost/weixin/oauth/access',
              success: 'http://localhost/weixin/oauth/success'
            },
            pay: { callback: 'http://localhost/weixin/pay/callback' }
          }
        }, res.body);
        done();
      });
  });

  it('should set certificate without pfx', function (done) {
    request(express)
      .post('/weixin/config/certificate')
      .field('pfxKey', 'key')
      .expect(200)
      .end(function (error, res) {
        // var content = fs.readFileSync(__dirname + '/fixtures/cert.p12');
        assert.equal(true, !error);
        console.log(res.body);
        assert.deepEqual({
          code: 0,
          name: 'Success',
          message: '成功！',
          data: { pfxKey: 'key', pfx: null }
        }, res.body);
        done();
      });
  });

  it('should set certificate config', function (done) {
    request(express)
      .post('/weixin/config/certificate')
      .field('pfxKey', 'key')
      .attach('pfx', filePath)
      .expect(200)
      .end(function (error, res) {
        var content = fs.readFileSync(filePath);
        assert.equal(true, !error);
        console.log(res.body);
        assert.deepEqual({
          code: 0,
          name: 'Success',
          message: '成功！',
          data: { pfxKey: 'key', pfx: content.toString('base64') }
        }, res.body);
        done();
      });
  });

  it('should get certificate config', function (done) {
    request(express)
      .get('/weixin/config/certificate')
      .expect(200)
      .end(function (error, res) {
        var content = fs.readFileSync(filePath);
        assert.equal(true, !error);
        console.log(res.body);
        assert.deepEqual({
          code: 0,
          name: 'Success',
          message: '成功！',
          data: { pfxKey: 'key', pfx: content.toString('base64') }
        }, res.body);
        done();
      });
  });
});
