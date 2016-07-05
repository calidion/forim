'use strict';
var config = require('./config');
var logger = require('./common/logger');
var app = require('./app');
var v2 = require('./v2');
var realConfig = config.waterline.dev;
if (!module.parent) {
  if (process.env.NODE_ENV === 'production') {
    realConfig = config.waterline.prod;
  }
  v2(realConfig, app, function () {
    app.listen(config.port, config.ip, function () {
      logger.info('Server listening on port', config.port);
      logger.info('Visit http://' + config.hostname + ':' + config.port);
    });
  });
}

module.exports = {
  app: app
};
