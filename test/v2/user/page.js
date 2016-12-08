var http = require('supertest');
var shared = require('../shared');
var server = require('../app');
var app;

describe('v2 user#page', function () {
  before(function (done) {
    server(function (data) {
      app = data;
      done();
    });
  });
  it('should show user index', function (done) {
    var req = http(app);
    req.get('/user/page/' + shared.user.username)
      .expect(200, function (err, res) {
        var texts = [
          '注册时间',
          '仍然很懒',
          '最近创建的话题',
          '无话题',
          '最近参与的话题',
          '无话题'
        ];
        texts.forEach(function (text) {
          res.text.should.containEql(text);
        });
        done(err);
      });
  });
});
