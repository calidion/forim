var http = require('supertest');
var vig = require('vig');
var assert = require('assert');

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
    process.env.FORIM_BY_PASS_POLICIES = 0;
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

  it('should get user profile', function (done) {
    process.env.FORIM_BY_PASS_POLICIES = 0;
    var req = http(app).get('/user/profile');
    req.cookies = shared.cookies;
    req
      .end(function (err, res) {
        shared.profile = res.body.data;
        done(err);
      });
  });

  it('Should connect to server', function (done) {
    process.env.FORIM_BY_PASS_POLICIES = 0;
    process.env.SOCKETIO_DEBUG = 1;
    var net = require('http').Server;
    var http = net(server);
    var sio = io(http, function (data) {
      assert(!data);
      sio.close();
      done();
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

  it('Should connect to server', function (done) {
    process.env.FORIM_BY_PASS_POLICIES = 1;
    var net = require('http').Server;
    var http = net(server);
    var sio = io(http, function (data) {
      data.to.should.eql('sdfsdf');
      data.message.should.eql('Hello World');
      sio.close();
      done();
    });
    sio.listen(port);
    sio.once('listening', function () {
      sio.close(function () {
      });
    });
    var client1 = ioc.connect(url, options);
    client1.on('connect', function () {
      client1.emit('message', {
        to: 'sdfsdf',
        message: 'Hello World'
      });
    });
  });

  // it('Should send to client', function (done) {
  //   process.env.FORIM_BY_PASS_POLICIES = 0;

  //   var entered = false;
  //   var net = require('http').Server;
  //   var http = net(server);
  //   var sio = io(http, function (data) {
  //     data.to.should.eql('sdfsdf');
  //     data.message.should.eql('Hello World');
  //   });
  //   sio.listen(port);
  //   sio.once('listening', function () {
  //     sio.close(function () {
  //     });
  //   });

  //   options.extraHeaders = {
  //     Cookie: shared.cookies
  //   };

  //   var client1 = ioc.connect(url, options);
  //   client1.on('connect', function () {
  //     vig.events.send('sio-message', {
  //       receiver: {
  //         id: '-1'
  //       }
  //     });
  //     client1.on('message', function () {
  //       if (!entered) {
  //         entered = true;
  //         sio.close();
  //         done();
  //       }
  //     });
  //   });
  // });

  it('Should send to client', function (done) {
    process.env.FORIM_BY_PASS_POLICIES = 0;

    var entered = false;
    var net = require('http').Server;
    var http = net(server);
    var sio = io(http, function (data) {
      data.to.should.eql('sdfsdf');
      data.message.should.eql('Hello World');
    });
    sio.listen(port);
    sio.once('listening', function () {
      sio.close(function () {
      });
    });

    options.extraHeaders = {
      Cookie: shared.cookies
    };
    var client1 = ioc.connect(url, options);
    client1.on('connect', function () {
      vig.events.send('sio-message', {
        receiver: {
          id: shared.profile.id
        }
      });
      client1.on('message', function () {
        if (!entered) {
          entered = true;
          sio.close();
          done();
        }
      });
    });
  });
});
