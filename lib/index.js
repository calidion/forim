'use strict';
var config = require('./config');
var logger = require('./common/logger');
var app = require('./app');
var v2 = require('./v2');
if (!module.parent) {
  v2(config.waterline, app, function () {
    app.listen(config.port, config.ip, function () {
      logger.info('Server listening on port', config.port);
      logger.info('Visit http://' + config.hostname + ':' + config.port);
    });
  });
}

module.exports = {
  app: app
};
