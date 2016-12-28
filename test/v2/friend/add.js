var http = require('supertest');
var shared = require('../shared');
var server = require('../app');
var app;

describe('v2 friend#add', function () {
  var username = shared.user.username;
  before(function (done) {
    server(function (data) {
      app = data;
      done();
    });
  });
  it('should add a friend', function (done) {
    var req = http(app).post('/friend/add');
    req.cookies = shared.cookies;
    req.send({
      email: 'calidion@gmail.com'
    }).expect(200, function (err, res) {
      res.body.should.eql({"code":0,"name":"Success","message":"成功！"});
      done(err);
    });
  });

});
