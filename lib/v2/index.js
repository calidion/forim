/**
 * Copyright(c) 2016 calidion <calidion@gmail.com>
 * Apache 2.0 Licensed
 */

var routers = require('./routers');
var vig = require('vig');
var errors = require('./errors');
var userHandlers = require('./handlers/user');

module.exports = function (config, app, cb) {
  var path = require('path');
  var dir = path.resolve(__dirname, './models/');
  vig.models.addDir(dir);
  vig.models.init(config, {
    connection: 'default'
  }, function (error, models) {
    if (error) {
      throw error;
    }
    vig.init(app, errors);
    app.use(function (req, res, next) {
      req.models = models;
      next();
    });
    vig.addHandlers(app, userHandlers);
    routers(app, models);
    cb(error);
  });
};
