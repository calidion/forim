var config = require('../config');

var env = process.env.NODE_ENV || "development"


var log4js = require('log4js');
log4js.configure({
  appenders: [
    { type: 'console' },
    { type: 'file', filename: 'logs/cheese.log', category: 'cheese', maxLogSize: config.log.size, backups: config.log.backups}
  ]
});

var logger = log4js.getLogger('cheese');
var level = config.debug ? 'DEBUG' : 'ERROR';
logger.setLevel(level);

module.exports = logger;
