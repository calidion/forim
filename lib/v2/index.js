/**
 * Forim - User Router
 * Copyright(c) 2016 calidion <calidion@gmail.com>
 * Apache 2.0 Licensed
 */
var waterline = require('./waterline');
var routers = require('./routers');

module.exports = function (config, app, cb) {
  waterline(config, function (error, ontology) {
    routers(app, ontology.collections);
    cb(error, ontology);
  });
};
