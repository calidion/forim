var userSockets = {
};

var vig = require('vig');

function Socket(sio, socket, cb) {
  socket.on('message', function (data) {
    if (cb && cb instanceof Function) {
      cb(data);
    }
  });
  socket.on('disconnect', function () {
    console.info('disconnected');
  });

  function sendMessage(receiver, message) {
    if (!receiver || !receiver.id) {
      return;
    }
    var id = receiver.id;
    var s = userSockets[id];
    if (s) {
      s.emit('message', message);
    }
  }
  vig.events.on('sio-message', function (message) {
    sendMessage(message.receiver, message);
    sendMessage(message.sender, message);
  });

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
    // socket.disconnect();
    cb && cb();
    return;
  }
  var user = socket.request.session.user;
  userSockets[user.id] = socket;
  userSockets['-1'] = socket;   // for test only
}

module.exports = {
  connected: Socket
};