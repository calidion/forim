var config = require('../config');
var Redis = require('ioredis');
var logger = require('./logger');

var client = new Redis(config.redis);

client.on('error', function (err) {
  if (err) {
    logger.error('connect to redis error, check your redis config', err);
    process.exit(1);
  }
});

exports = module.exports = client;
