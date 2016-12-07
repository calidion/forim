var config = require('./config');
var session = require('express-session');
var RedisStore = require('connect-redis')(session);

module.exports = session({
  secret: config.session_secret,
  store: new RedisStore(config.redis),
  cookie: {
    secure: false
  },
  resave: false,
  saveUninitialized: false
});