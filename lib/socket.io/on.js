var userSockets = {
};

var vig = require('vig');

function Socket(sio, socket, cb) {
  var user = socket.request.session;
  // socket.request.session // Now it's available from Socket.IO sockets too! Win!
  if (process.env.FORIM_BY_PASS_POLICIES > 0) {
    if (!socket.request.session.user) {
      socket.request.session.user = {
        id: 1
      };
    }
  }
  if (!socket.request.session.user) {
    console.error('No user found!');
    socket.disconnect();
    cb();
    return;
  }
  var user = socket.request.session.user;
  userSockets[user.id] = socket;
  userSockets['-1'] = socket;   // for test only
  socket.on('message', function (data) {
    if (cb && cb instanceof Function) {
      cb(data);
    }
  });
  socket.on('disconnect', function () {
    console.info('disconnected');
  });
  vig.events.on('sio-message', function (message) {
    var id = message.receiver.id;
    var userSocket = userSockets[id];
    if (userSocket) {
      userSocket.emit('message', message);
    }
  });
}

module.exports = {
  connected: Socket
};