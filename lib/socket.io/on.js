
function Socket(socket, receiver) {
  socket.request.session // Now it's available from Socket.IO sockets too! Win!

  socket.on('message', function (from, to, message) {
    console.log(from, to, message);
  });
  socket.on('disconnect', function () {
    console.log('user disconnected');
  });
}

module.exports = Socket;