'use strict';
var config = require('./config');
var app = require('./app');
var v2 = require('./v2');
var realConfig = config.waterline.dev;
if (!module.parent) {
  if (process.env.NODE_ENV === 'production') {
    realConfig = config.waterline.prod;
  }
  v2(realConfig, app, function () {
    app.listen(config.port, config.ip, function () {
      console.log('Server listening on port', config.port);
      console.log('Visit http://' + config.hostname + ':' + config.port);
    });
  });
}

module.exports = {
  app: app
};
