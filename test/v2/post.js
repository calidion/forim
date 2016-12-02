var http = require('supertest');
var server = require('./app');
var app;
var shared = require('./shared');
var cookies;
var postId;

describe('v2 post', function () {
  before(function (done) {
    server(function (data) {
      app = data;
      done();
    });
  });
  it('should login in successful', function (done) {
    process.env.FORIM_BY_PASS_POLICIES = 0;
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

  it('should not create a post when no login', function (done) {
    var req = http(app).post('/post/create/' + shared.thread.id);
    req
      .send({
        content: '木耳敲回车 @sfdsdf @forim'
      })
      .expect(403, function (err, res) {
        res.text.should.equal('Access Denied!');
        done(err);
      });
  });

  it('should not create a post when no login', function (done) {
    var req = http(app).post('/post/create/' + shared.thread.id);
    req.cookies = shared.cookies;
    req
      .send({
        content: ''
      })
      .expect(403, function (err, res) {
        res.text.should.equal('Access Denied!');
        done(err);
      });
  });
  it('should create a post', function (done) {
    var req = http(app).post('/post/create/' + shared.thread.id);
    req.cookies = shared.cookies;
    req
      .send({
        content: '木耳敲回车 @sfdsdf @forim'
      })
      .expect(302, function (err, res) {
        var ids = /^\/thread\/visit\/(\w+)#(\w+)$/.exec(res.headers.location);
        var threadId = ids[1];
        postId = ids[2];
        threadId.should.equal(shared.thread.id);
        postId.should.not.be.empty();
        done(err);
      });
  });

  it('should create a post with parent', function (done) {
    var req = http(app).post('/post/create/' + shared.thread.id);
    req.cookies = shared.cookies;
    req
      .send({
        content: '@ssdf 木耳敲回车 @sfdsdf @forim',
        parent: postId
      })
      .expect(302, function (err, res) {
        var ids = /^\/thread\/visit\/(\w+)#(\w+)$/.exec(res.headers.location);
        var threadId = ids[1];
        var post = ids[2];
        threadId.should.equal(shared.thread.id);
        post.should.not.be.empty();
        done(err);
      });
  });

  it('should not edit a post', function (done) {
    var req = http(app).post('/post/edit/' + postId);
    req
      .send({
        content: '@ssdf 木耳敲回车 @sfdsdf @forim new'
      })
      .expect(403, function (err, res) {
        res.text.should.equal('Access Denied!');
        done(err);
      });
  });

  it('should edit a post', function (done) {
    var req = http(app).post('/post/edit/' + postId);
    req.cookies = shared.cookies;
    req
      .send({
        content: '@ssdf 木耳敲回车 @sfdsdf @forim new'
      })
      .expect(302, function (err, res) {
        var ids = /^\/thread\/visit\/(\w+)#(\w+)$/.exec(res.headers.location);
        var threadId = ids[1];
        var post = ids[2];
        threadId.should.equal(shared.thread.id);
        post.should.equal(postId);
        done(err);
      });
  });
});
