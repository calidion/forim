var IO = require("socket.io");
var session = require('./session');

module.exports = function (server) {
  var sio = IO(server);
  sio.use(function (socket, next) {
    session(socket.request, socket.request.res, next);
  });
  sio.sockets.on("connection", function (socket) {
    socket.request.session // Now it's available from Socket.IO sockets too! Win!
  });
}