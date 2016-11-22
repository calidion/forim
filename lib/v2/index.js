/**
 * Forim - User Router
 * Copyright(c) 2016 calidion <calidion@gmail.com>
 * Apache 2.0 Licensed
 */
var routers = require('./routers');
var vig = require('vig');
var errors = require('./errors');
// var handlers = [];

module.exports = function (config, app, cb) {
  console.log('inited');
  vig.init(app, errors);
  // vig.addHandlers(app, handlers);
  var path = require('path');
  var dir = path.resolve(__dirname, './models/');
  vig.models.addDir(dir);
  vig.models.init(config, {
    connection: 'default'
  }, function (error, models) {
    console.log('inited 1');
    console.log(error, models);
    if (error) {
      throw error;
    }
    routers(app, models);
    cb(error);
  });
  // waterline(config, function (error, ontology) {
  //   routers(app, ontology.collections);
  //   cb(error, ontology);
  // });
};
