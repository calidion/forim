var IO = require("socket.io");
var session = require('./session');

var sockets = {};

module.exports = function (server) {
  var sio = IO(server);
  sio.use(function (socket, next) {
    session(socket.request, socket.request.res, next);
  });

  var io = {
    onConnect: function (socket) {
      console.log('onConnect should be overriden');
    }
  };
  sio.sockets.on("connection", function (socket) {
    if (io.onConnect) {
      io.onConnect(socket);
    }
  });
  return io;
};
