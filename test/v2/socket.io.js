var http = require('supertest');

// var assert = require('assert');

var io = require('../../lib/socket.io');
var ioc = require('socket.io-client');
// var url = 'ws://localhost';
var server = require('./app');

var app;
var shared = require('./shared');

var port = 10086;
var options = {
  reconnection: false
};
var url = 'ws://localhost:' + port;

describe('v2 socket.io', function () {
  before(function (done) {
    server(function (data) {
      app = data;
      done();
    });
  });
  it('should login in successful', function (done) {
    var req = http(app);
    req.post('/user/login')
      .send(shared.user)
      .end(function (err, res) {
        var re = new RegExp('; path=/; httponly', 'gi');
        var cookies = res.headers['set-cookie']
          .map(function (r) {
            return r.replace(re, '');
          }).join("; ");
        shared.cookies = cookies;
        res.status.should.equal(302);
        res.headers.location.should.equal('/');
        done(err);
      });
  });

  it('Should connect to server', function (done) {
    var net = require('http').Server;
    var http = net(server);
    var sio = io(http, {
      onConnect: function (socket) {
        socket.on('message', function (data) {
          data.should.be.eql('user1');
          done();
        });
      }
    });
    sio.listen(port);
    sio.once('listening', function () {
      sio.close(function () {
      });
    });
    var client1 = ioc.connect(url, options);
    client1.on('connect', function () {
      client1.emit('message', 'user1');
    });
  });
});
