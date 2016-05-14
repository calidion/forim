var config = require('../config');

var log4js = require('log4js');
log4js.configure(config.log4js);

var logger = log4js.getLogger('cheese');
var level = config.debug ? 'DEBUG' : 'ERROR';
logger.setLevel(level);

module.exports = logger;
