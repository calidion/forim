var mailer = require('../v2/util/mailer');

var userSockets = {
};

var vig = require('vig');

function getMessage(user) {
  if (vig._models) {
    var InstantMessage = vig._models.InstantMessage;
    var options = {
      or: [
        {
          sender: user.id,
          read: false
        },
        {
          receiver: user.id,
          read: false
        }
      ]
    };
    InstantMessage.find(options)
    .populate('receiver')
    .populate('sender').sort({
        createdAt: 'desc'
      }).then(function (messages) {
        messages.forEach(function(message) {
          vig.events.send('sio-message', message);
        });
      }).fail(function(error) {
        console.error(error);
      });
  }
}

function sendMessage(receiver, message) {
  if (!receiver || !receiver.id) {
    return false;
  }
  var id = receiver.id;
  var s = userSockets[id];
  if (s) {
    s.emit('message', message);
  } else {
    return false;
  }
  return true;
}

vig.events.on('sio-message', function (message) {

  // Send Message to sender 
  sendMessage(message.sender, message);

  // Send Message to receiver 
  if (!sendMessage(message.receiver, message)) {
    console.log('when not online ');
    console.log(mailer.message.new);
    mailer.message.new(message.receiver, message.sender, function () { });
  }
});

function Socket(sio, socket, cb) {
  socket.on('message', function (data) {
    if (cb && cb instanceof Function) {
      cb(data);
    }
  });
  socket.on('disconnect', function () {
    delete userSockets[socket._uid];
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
  console.log('new connection established');
  console.log(user);
  
  userSockets[user.id] = socket;
  userSockets['-1'] = socket;   // for test only
  socket._uid = user.id;
  getMessage(user);
}

module.exports = {
  connected: Socket
};