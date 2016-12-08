'use strict';
var Server = require("http").Server;
var config = require('./config');
var app = require('./app');
var v2 = require('./v2/');
var sio = require('./socket.io');
var realConfig = config.waterline.dev;
var server = Server(app);
// sio(server);

module.exports = function (conf, cb) {
  v2(conf, app, function () {
    cb(server);
  });
}
