var mongoose = require('mongoose');
var logger = require('../common/logger');
var config = require('../config');

var traceMQuery = function(method, info, query) {
  return function(err, result, millis) {
    if (config.mongoose && config.mongoose.trace) {
      if (err) {
        logger.error('traceMQuery error:', err)
      }
      var infos = [];
      infos.push(query._collection.collection.name + "." + method.blue);
      infos.push(JSON.stringify(info));
      infos.push((millis + 'ms').green);

      logger.debug("MONGO".magenta, infos.join(' '));
    }
  }
};
mongoose.Mongoose.prototype.mquery.setGlobalTraceFunction(traceMQuery);
