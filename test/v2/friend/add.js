var http = require('supertest');
var shared = require('../shared');
var server = require('../app');
var app;

var email = 'calidion@gmail.com';
var token;

describe('v2 friend', function () {
  before(function (done) {
    server(function (data) {
      app = data;
      var MessageFriend = app.models.MessageFriend;
      MessageFriend.destroy({}).exec(function () {
        done();
      });
    });
  });
  it('should add a friend not registerred', function (done) {
    process.env.FORIM_BY_PASS_POLICIES = 0;
    var req = http(app).post('/friend/add');
    req.cookies = shared.cookies;
    req.send({
      email: email
    }).expect(200, function (err, res) {
      res.body.should.containDeepOrdered({
        code: 0,
        name: 'Success',
        message: '成功！',
        data: {
          email: email
        }
      });
      token = res.body.data.token;
      done(err);
    });
  });
  it('should acceptable an invitation', function (done) {
    process.env.FORIM_INVITATION_IGNORE = 1;
    var req = http(app).get('/friend/ack').query({
      token: token,
      email: email
    });
    req.cookies = shared.cookies;
    req.expect(200, function (err, res) {
      res.body.should.containDeepOrdered({
        code: 0, name: 'Success', message: '成功！'
      });
      done(err);
    });
  });
  it('should not acceptable more than once', function (done) {
    process.env.FORIM_INVITATION_IGNORE = 1;
    var req = http(app).get('/friend/ack').query({
      token: token,
      email: email
    });
    req.cookies = shared.cookies;
    req.expect(200, function (err, res) {
      res.body.should.containDeepOrdered({
        code: 'MessageProcessed',
        message: '消息已经处理过！',
        name: 'MessageProcessed'
      });
      done(err);
    });
  });
});
