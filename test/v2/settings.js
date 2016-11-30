var http = require('supertest');
var assert = require('assert');
var server = require('./app');
var app;

describe('v2 settings', function () {
  var id;
  var one;
  before(function (done) {
    server(function (data) {
      app = data;
      done();
    });
  });
  it('should clear settings', function (done) {
    process.env.FORIM_BY_PASS_POLICIES = 1;
    var req = http(app);
    req.post('/v2/weixin/settings')
      .send({
        action: 'delete'
      })
      .end(function (error, res) {
        assert(!error);
        var body = res.body;
        assert(body.code === 0);
        done();
      });
  });

  it('should create a settings item', function (done) {
    process.env.FORIM_BY_PASS_POLICIES = 1;
    process.env.FORIM_MOCK_USER = 1;
    var req = http(app);
    req.post('/v2/weixin/settings/user')
      .send({
        action: 'create',
        key: 'weixin',
        value: JSON.stringify({
          hello: 'world'
        })
      })
      .end(function (error, res) {
        assert(!error);
        var body = res.body;
        assert(body.code === 0);
        assert(body.data);
        assert(body.data.id);
        id = body.data.id;
        one = body.data;
        done();
      });
  });

  it('should not create a settings item 1', function (done) {
    process.env.FORIM_BY_PASS_POLICIES = 1;
    var req = http(app);
    req.post('/v2/weixin/settings/user')
      .send({
        action: 'create',
        if: 'weixin',
        no: JSON.stringify({
          hello: 'world'
        })
      })
      .expect(200)
      .end(function (error, res) {
        assert(!error);
        assert.deepEqual(res.body, {
          code: 2,
          name: 'InputInvalid',
          message: '输入无效!'
        });
        done();
      });
  });

  it('should not create a settings item 2', function (done) {
    process.env.FORIM_BY_PASS_POLICIES = 0;
    var req = http(app);
    req.post('/v2/weixin/settings/user')
      .send({
        action: 'create',
        key: 'weixin',
        value: JSON.stringify({
          hello: 'world'
        })
      })
      .expect(302)
      .end(done);
  });

  it('should not create a settings item 3', function (done) {
    process.env.FORIM_BY_PASS_POLICIES = 1;
    var req = http(app);
    req.post('/v2/weixin/settings/user')
      .send({
        action: 'list',
        key: 'weixin',
        value: JSON.stringify({
          hello: 'world'
        })
      })
      .expect(404)
      .end(done);
  });

  it('should get settings list', function (done) {
    process.env.FORIM_BY_PASS_POLICIES = 1;
    var req = http(app);
    req.get('/v2/weixin/settings?limit=10&page=1')
      .end(function (error, res) {
        assert(!error);
        var body = res.body;
        assert(body.code === 0);
        var data = body.data;
        assert(data.total >= 1);
        assert(data.page >= 1);
        assert(data.count >= 1);
        assert(data.results.length >= 1);
        done();
      });
  });

  it('should get settings info', function (done) {
    process.env.FORIM_BY_PASS_POLICIES = 1;
    var req = http(app);
    req.get('/v2/weixin/settings/' + id)
      .end(function (error, res) {
        assert(!error);
        var body = res.body;
        assert(body.code === 0);
        assert(body.data);
        assert.deepEqual(body.data, one);
        done();
      });
  });

  it('should get settings info', function (done) {
    process.env.FORIM_BY_PASS_POLICIES = 0;
    var req = http(app);
    req.get('/v2/weixin/settings/' + id)
      .expect(403)
      .end(done);
  });

  it('should not get settings', function (done) {
    process.env.FORIM_BY_PASS_POLICIES = 1;
    var req = http(app);
    req.get('/v2/weixin/settings/100000')
      .end(function (error, res) {
        assert(!error);
        var body = res.body;
        assert(body.name === 'NotFound');
        assert(!body.data);
        done();
      });
  });
});
