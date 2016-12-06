/**
 * Copyright(c) 2016 calidion <calidion@gmail.com>
 * Apache 2.0 Licensed
 */

var routers = require('./routers');
var vig = require('vig');
var errors = require('./errors');
var handlers = require('./handlers/');
var oauth = require('./oauth');

module.exports = function (config, app, cb) {
  oauth(app);
  var path = require('path');
  var dir = path.resolve(__dirname, './models/');
  vig.models.addDir(dir);
  vig.models.init(config, {
    connection: 'default'
  }, function (error, models) {
    if (error) {
      console.error('数据库出错,请检查你的配置！');
      console.error(error, config.connections);
      throw error;
    }
    vig.init(app, errors);
    routers(app, models);
    app.models = models;
    vig.addHandlers(app, handlers);
    cb(error);
  });
};
