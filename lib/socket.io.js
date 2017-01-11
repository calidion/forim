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
    'websocket',
    'flashsocket',
    'htmlfile',
    'xhr-polling',
    'jsonp-polling',
    'polling'
  ]);
  sio.origins('*:*')
  sio.sockets.on("connection", function (socket) {
    console.info('New connection established!');
    onIO.connected(sio, socket, cb);
  });
  console.log('inside socket.io');
  return sio;
};
