var SIO = require("socket.io");
var session = require('./session');

var onIO = require('./socket.io/on');

var sockets = {};

module.exports = function (server, cb) {
  var sio = SIO(server);
  sio.use(function (socket, next) {
    session(socket.request, socket.request.res, next);
  });
  sio.sockets.on("connection", function (socket) {
    console.log('inside');
    onIO.connected(sio, socket, cb);
  });
  return sio;
};
