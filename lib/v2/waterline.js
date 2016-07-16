/**
 * Forim - User Router
 * Copyright(c) 2016 calidion <calidion@gmail.com>
 * Apache 2.0 Licensed
 */
var Waterline = require('waterline');
var waterline = new Waterline();
var models = require('./waterline/index');
for (var i = 0; i < models.length; i++) {
  var connection = Waterline.Collection.extend(models[i]);
  waterline.loadCollection(connection);
}

var callback = function (cb) {
  return function (error, ontology) {
    if (error) {
      return console.error(error);
    }
    cb(error, ontology);
  };
};

module.exports = function (config, cb) {
  waterline.initialize(config, callback(cb));
};
module.exports.callback = callback;
