/*!
 * nodeclub - app.js
 */

/**
 * Module dependencies.
 */
/* eslint space-before-function-paren: 0 */

var config = require('./config');
var path = require('path');
var express = require('express');
var session = require('express-session');
require('./models');
var webRouter = require('./web_router');
var apiRouterV1 = require('./api_router_v1');
var auth = require('./middlewares/auth');
var errorPageMiddleware = require('./middlewares/error_page');
var proxyMiddleware = require('./middlewares/proxy');
var RedisStore = require('connect-redis')(session);
var _ = require('lodash');
var csurf = require('csurf');
var compress = require('compression');
var bodyParser = require('body-parser');
var busboy = require('connect-busboy');
var errorhandler = require('errorhandler');
var logger = require('./common/logger');
var helmet = require('helmet');
var bytes = require('bytes');

var urlinfo = require('url').parse(config.host);
config.hostname = urlinfo.hostname || config.host;

var app = express();
app.use(function (req, res, next) {
  req._config = config;
  next();
})

// configuration in all env
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
app.engine('html', require('ejs-mate'));
app.locals._layoutFile = 'layout.html';
app.enable('trust proxy 1');

// 静态文件目录
app.use('/public', express.static(config.static.path));
app.use('/agent', proxyMiddleware.proxy);

// 通用的中间件
app.use(require('response-time')());
app.use(helmet.frameguard('sameorigin'));
app.use(bodyParser.json({
  limit: '1mb'
}));
app.use(bodyParser.urlencoded({
  extended: true,
  limit: '1mb'
}));
app.use(require('method-override')());
app.use(require('cookie-parser')());
app.use(compress());
app.use(session({
  secret: config.session_secret,
  store: new RedisStore(config.redis),
  cookie: {
    secure: false
  },
  resave: false,
  saveUninitialized: false
}));

// custom middleware
// app.use(auth.authUser);
app.use(function (req, res, next) {
  var user = req.session.user;
  var enterred = false;
  res.locals.current_user = null;
  var data = {};
  for (var key in user) {
    if (typeof key === 'string') {
      data[key] = user[key];
      enterred = true;
    }
  }
  if (enterred) {
    res.locals.current_user = data;
  }
  next();
})

if (!config.debug) {
  app.use(function (req, res, next) {
    if (req.path === '/api' || req.path.indexOf('/api') === -1) {
      csurf()(req, res, next);
      return;
    }
    next();
  });
  app.set('view cache', true);
}

// for debug
// app.get('/err', function (req, res, next) {
//   next(new Error('haha'))
// });

// set static, dynamic helpers
_.extend(app.locals, {
  config: config
});

app.use(errorPageMiddleware.errorPage);
_.extend(app.locals, require('./common/render_helper'));
app.use(function (req, res, next) {
  res.locals.csrf = req.csrfToken ? req.csrfToken() : '';
  next();
});

// app.use(busboy({
//   limits: {
//     fileSize: bytes(config.file_limit)
//   }
// }));

// routes
app.use('/api/v1', function (req, res, next) {
  if (req.headers.origin) {
    res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
  }
  next();
}, apiRouterV1);

app.use('/', webRouter);

// error handler
if (config.debug) {
  app.use(errorhandler());
} else {
  app.use(function (err, req, res) {
    logger.error(err);
    return res.status(500).send('500 status');
  });
}
module.exports = app;
