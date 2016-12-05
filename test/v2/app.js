var app = require('../../lib/app');
var v2 = require('../../lib/v2');
var config = require('../../lib/config');

var realConfig = config.waterline.dev;
var initialized = false;
module.exports = function (cb) {
  if (initialized) {
    return cb(app);
  }
  v2(realConfig, app, function () {
    cb(app);
    initialized = true;
  });
};

