/**
 * Forim - User Router
 * Copyright(c) 2016 calidion <calidion@gmail.com>
 * Apache 2.0 Licensed
 */
var errorableExpress = require('errorable-express');
var errors = require('./errors');

var validator = require('node-form-validator');
var filters = require('./filters');
var policies = require('./policies');

// Routers
var userRouter = require('./routers/user');
var settingsRouter = require('./routers/settings');

// Weixin
var weixinRouter = require('node-weixin-router');
var weixinSession = require('node-weixin-session');
var weixinSettings = require('node-weixin-settings');
var weixinConfig = require('node-weixin-express-config');


var skipper = require('skipper');

function getId(req) {
  var id = req.session && req.session.user && req.session.user._id;
  if (!id) {
    id = -1;
  }
  return id;
}

module.exports = function (app, models) {
  // Init Errorable

  app.use(errorableExpress(errors));
  app.use(validator.asConnect);

  app.use(filters);
  app.use(policies);

  // For weixin config
  app.use(skipper());

  // Init HTTP standard status
  app.use(function (req, res, next) {
    res._notFound = function () {
      res.status(404);
      res.type('txt').send('Not Found!');
    };
    res._accessDenied = function () {
      res.status(403);
      res.type('txt').send('Access Denied!');
    };
    next();
  });

  // Init routers
  var user = userRouter(models.user);
  var settings = settingsRouter(models.settings);

  app.use('/v2/users', user);
  app.use('/v2/settings', settings);

  weixinRouter.express(weixinSettings, weixinSession, app, '/weixin/api');
  weixinRouter.getId = function (req, next) {
    next(getId(req));
  };
  weixinConfig.set.set(weixinSettings, app, function callback(req, res, id, value) {
    res.errorize(res.errors.Success, value);
  }, function (req) {
    return getId(req);
  },
    'xxx', // 忽略
    '/weixin/config/:type' // 必须有:type, 包默认会处理
  );
};
