var SIO = require("socket.io");
var session = require('./session');

var sockets = {};

module.exports = function (server, io) {
  var sio = SIO(server);
  sio.use(function (socket, next) {
    session(socket.request, socket.request.res, next);
  });

  if (!io) {
    io = {
    };
  }
  sio.sockets.on("connection", function (socket) {
    if (io.onConnect) {
      io.onConnect(socket);
    }
  });
  return sio;
};
