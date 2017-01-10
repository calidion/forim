var userSockets = {
};

function Socket(sio, socket, cb) {
  var user = socket.request.session;
  // socket.request.session // Now it's available from Socket.IO sockets too! Win!


  if (process.env.FORIM_BY_PASS_POLICIES > 0) {
    socket.request.session.user = {
      id: 1
    };
  }
  if (!socket.request.session.user) {
    console.error('no user found!');
    socket.disconnect();
    cb();
    return;
  }
  var user = socket.request.session.user;
  userSockets[user.id] = user;
  socket.on('message', function (data) {
    console.log('log message');
    if (cb && cb instanceof Function) {
      cb(data);
    }
  });
  socket.on('disconnect', function () {
    console.log('disconnected');
  });
}

module.exports = {
  connected: Socket,
  getSocket: function (user) {
    return userSockets[user.id]
  }
};