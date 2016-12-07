'use strict';
var config = require('./config');
var boot = require('./boot');
var realConfig = config.waterline.dev;
if (!module.parent) {
  if (process.env.NODE_ENV === 'production') {
    realConfig = config.waterline.prod;
  }
  boot(realConfig, function (server) {
    server.listen(config.port, config.ip, function () {
      console.log('Server listening on port', config.port);
      console.log('Visit http://' + config.hostname + ':' + config.port);
    });
  });
}

module.exports = {
  app: app
};
