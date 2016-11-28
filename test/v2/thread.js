var http = require('supertest');
var github = require('../../lib/v2/handlers/oauth/github/');
var config = require('../../lib/config');
var assert = require('assert');
var server = require('./app');
var app;
var shared = require('./shared');

describe('v2 thread', function () {
  before(function (done) {
    server(function (data) {
      app = data;
      done();
    });
  });
  it('should login in successful', function (done) {
    var req = http(app);
    req.post('/signin')
      .send(shared.user)
      .end(function (err, res) {
        var re = new RegExp('; path=/; httponly', 'gi');
        cookies = res.headers['set-cookie']
          .map(function (r) {
            return r.replace(re, '');
          }).join("; ");
        shared.cookies = cookies;
        res.status.should.equal(302);
        res.headers.location.should.equal('/');
        done(err);
      });
  });

  it('should get the creating page', function (done) {
    var req = http(app).get('/topic/create');
    req.cookies = cookies;
    req
      .expect(200)
      .end(function (err, res) {
        res.text.should.containEql('发布话题');
        done(err);
      });
  });
  it('should unable to create when info missing', function (done) {
    var req = http(app).post('/topic/create');
    req.cookies = shared.cookies;
    req
      .send({
        tab: config.tabs[0][0],
        content: '木耳敲回车'
      })
      .expect(403, function (err, res) {
        res.text.should.containEql('发布话题');
        done(err);
      });
  });
  it('should create a thread', function (done) {
    var req = http(app).post('/topic/create');
    req.cookies = shared.cookies;
    req
      .send({
        title: '呵呵复呵呵' + new Date(),
        tab: config.tabs[0][0],
        content: '木耳敲回车'
      })
      .expect(302, function (err, res) {
        var id = /^\/topic\/(\w+)$/.exec(res.headers.location);
        assert(id.length);
        assert(id[1]);
        shared.thread.id = id[1];
        done(err);
      });
  });

  it('should be able to get an edit page', function (done) {
    var req = http(app).get('/topic/' + shared.thread.id + '/edit');
    req.cookies = shared.cookies;
    req
      .expect(200, function (err, res) {
        res.text.should.containEql('编辑话题');
        done(err);
      });
  });

  it('should edit a thread', function (done) {
    var req = http(app).post('/topic/' + shared.thread.id + '/edit');
    req.cookies = shared.cookies;
    req
      .send({
        title: '修改后的Title',
        tab: 'share',
        content: '修改修改的内容!'
      })
      .expect(302, function (err, res) {
        console.log(err, res.text);
        res.headers.location.should.match(/^\/topic\/\w+$/);
        done(err);
      });
  });
  it('should not delete a thread', function (done) {
    var req = http(app).post('/topic/' + shared.thread.id + '/delete');
    req
      .expect(403, function (err, res) {
        assert(!err);
        res.text.should.containEql('你无权删除当前话题');
        done(err);
      });
  });
  it('should delete a thread', function (done) {
    var req = http(app).post('/topic/' + shared.thread.id + '/delete');
    req.cookies = shared.cookies;
    req
      .expect(200, function (err, res) {
        res.body.should.eql({ success: true, message: '话题已被删除。' });
        done(err);
      });
  });
});
