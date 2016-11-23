/**
 * Copyright(c) 2016 calidion <calidion@gmail.com>
 * Apache 2.0 Licensed
 */

var routers = require('./routers');
var vig = require('vig');
var errors = require('./errors');
var handlers = [];

module.exports = function (config, app, cb) {
  vig.init(app, errors);
  vig.addHandlers(app, handlers);
  var path = require('path');
  var dir = path.resolve(__dirname, './models/');
  vig.models.addDir(dir);
  vig.models.init(config, {
    connection: 'default'
  }, function (error, models) {
    if (error) {
      throw error;
    }
    routers(app, models);
    cb(error);
  });
};
