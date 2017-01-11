var SIO = require("socket.io");
var session = require('./session');

var onIO = require('./socket.io/on');

var sockets = {};

module.exports = function (server, cb) {
  var sio = SIO(server);
  sio.use(function (socket, next) {
    session(socket.request, socket.request.res, next);
  });
  sio.set('transports', [
    'websocket'
  ]);
  sio.sockets.on("connection", function (socket) {
    console.info('New connection established!');
    onIO.connected(sio, socket, cb);
  });
  return sio;
};
