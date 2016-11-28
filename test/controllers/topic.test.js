
var app = require('../../lib/app');
var request = require('supertest')(app);
var support = require('../support/support');
var mm = require('mm');
var config = require('../../lib/config');

describe('test/controllers/topic.test.js', function () {

  before(function (done) {
    support.ready(done);
  });

  afterEach(function () {
    mm.restore();
  });

  // describe('#index', function () {
  //   it('should get /topic/:tid 200', function (done) {
  //     request.get('/topic/' + support.testTopic._id)
  //     .expect(200, function (err, res) {
  //       res.text.should.containEql('test topic content');
  //       res.text.should.containEql('alsotang');
  //       done(err);
  //     });
  //   });

  //   it('should get /topic/:tid 200 when login in', function (done) {
  //     request.get('/topic/' + support.testTopic._id)
  //     .set('Cookie', support.normalUser2Cookie)
  //     .expect(200, function (err, res) {
  //       res.text.should.containEql('test topic content');
  //       res.text.should.containEql('alsotang');
  //       done(err);
  //     });
  //   });
  // });

  describe('#top', function () {
    it('should top a topic', function (done) {
      request.post('/topic/' + support.testTopic._id + '/top')
      .set('Cookie', support.adminUserCookie)
      .expect(200, function (err, res) {
        res.text.should.containEql('此话题已置顶。');
        done(err);
      });
    });

    it('should untop a topic', function (done) {
      request.post('/topic/' + support.testTopic._id + '/top')
      .set('Cookie', support.adminUserCookie)
      .expect(200, function (err, res) {
        res.text.should.containEql('此话题已取消置顶');
        done(err);
      });
    });
  });

  describe('#good', function () {
    it('should good a topic', function (done) {
      request.post('/topic/' + support.testTopic._id + '/good')
      .set('Cookie', support.adminUserCookie)
      .expect(200, function (err, res) {
        res.text.should.containEql('此话题已加精。');
        done(err);
      });
    });

    it('should ungood a topic', function (done) {
      request.post('/topic/' + support.testTopic._id + '/good')
      .set('Cookie', support.adminUserCookie)
      .expect(200, function (err, res) {
        res.text.should.containEql('此话题已取消加精。');
        done(err);
      });
    });
  });

  describe('#upload', function () {
    it('should upload a file', function (done) {

      // mm(store, 'upload', function (file, options, callback) {
      //   callback(null, {
      //     url: 'upload_success_url'
      //   });
      // });
      request.post('/upload')
      .attach('selffile', __filename)
      .set('Cookie', support.normalUser2Cookie)
      .end(function (err, res) {
        res.body.success.should.eql(true);
        res.body.url.should.containEql('http://');
        done(err);
      });
    });
  });

  describe('#lock', function () {
    it('should lock a topic', function (done) {
      request.post('/topic/' + support.testTopic._id + '/lock')
      .set('Cookie', support.adminUserCookie)
      .expect(200, function (err, res) {
        res.text.should.containEql('此话题已锁定。');
        done(err);
      });
    });

    it('should not reply a locked topic', function (done) {
      var topic = support.testTopic;
      request.post('/' + topic._id + '/reply')
      .set('Cookie', support.normalUserCookie)
      .send({
        r_content: 'test reply 1'
      })
      .expect(403)
      .end(function (err, res) {
        res.text.should.equal('此主题已锁定。');
        done(err);
      });
    });

    it('should unlock a topic', function (done) {
      request.post('/topic/' + support.testTopic._id + '/lock')
      .set('Cookie', support.adminUserCookie)
      .expect(200, function (err, res) {
        res.text.should.containEql('此话题已取消锁定。');
        done(err);
      });
    });

    it('should reply a unlocked topic', function (done) {
      var topic = support.testTopic;
      request.post('/' + topic._id + '/reply')
      .set('Cookie', support.normalUserCookie)
      .send({
        r_content: 'test reply 1'
      })
      .expect(302)
      .end(function (err, res) {
        done(err);
      });
    });
  });
});
