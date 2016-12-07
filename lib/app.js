/*!
 * nodeclub - app.js
 */

/**
 * Module dependencies.
 */
/* eslint space-before-function-paren: 0 */

var path = require('path');
var express = require('express');
var session = require('express-session');
var RedisStore = require('connect-redis')(session);
var _ = require('lodash');
var csurf = require('csurf');
var compress = require('compression');
var bodyParser = require('body-parser');
var config = require('./config');

var moment = require('moment');
moment.locale('zh-cn');


var urlinfo = require('url').parse(config.host);
config.hostname = urlinfo.hostname || config.host;

var app = express();

// var nunjucks = require('nunjucks');

// nunjucks.configure('views', {
//     autoescape: true,
//     express: app
// });

// configuration in all env
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
app.engine('html', require('ejs-mate'));
app.locals._layoutFile = 'layout.html';
app.locals.ago = function (time) {
  if (!time) {
    return '';
  }
  var gap = new Date() - time;
  var ago = moment(new Date(time));
  if (gap > 24 * 3600 * 1000) {
    return ago.format('YYYY-MM-DD HH:mm:ss');
  }
  return ago.fromNow();
};

app.enable('trust proxy 1');

// 静态文件目录
app.use('/public', express.static(config.static.path));

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

app.use(function (req, res, next) {
  res.showPage = function (template, data, status) {
    if (!data) {
      data = {};
    }
    data.current_user = null;
    if (req.session.user) {
      var user = {};
      for (var k in req.models.User.attributes) {
        if (typeof k === 'string') {
          user[k] = req.session.user[k];
        }
      }
      data.current_user = user;
    }
    data.config = config;
    data.csrf = req.crsfToken ? req.csrfToken() : '';
    if (status) {
      res.status(status);
    }
    res.render(template, data);
  }
  next();
});
module.exports = app;
