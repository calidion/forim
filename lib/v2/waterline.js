/**
 * Forim - User Router
 * Copyright(c) 2016 calidion <calidion@gmail.com>
 * Apache 2.0 Licensed
 */
var Waterline = require('waterline');
// Models
var User = require('./waterline/user');
var Settings = require('./waterline/settings');
var waterline = new Waterline();
var defines = [User, Settings];
for (var i = 0; i < defines.length; i++) {
  var connection = Waterline.Collection.extend(defines[i]);
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
