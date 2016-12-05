/**
 * Forim - User Router
 * Copyright(c) 2016 calidion <calidion@gmail.com>
 * Apache 2.0 Licensed
 */
var v2 = require('./v2/');
module.exports = function (config, app, cb) {
  v2(config, app, cb);
};
