/**
 * Forim - User Router
 * Copyright(c) 2016 calidion <calidion@gmail.com>
 * Apache 2.0 Licensed
 */

var skipper = require('skipper');

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
var weixinConfig = require('node-weixin-express-config');

var weixinSettingsFunc = require('./weixin/settings.session');
var weixinStorage = require('./weixin/storage.session');

var weixinSettingsIdFunc = require('./weixin/settings.id');
var weixinStorageId = require('./weixin/storage.id');

var getId = require('./util/getId');

module.exports = function (app, models) {
  // Init Errorable

  app.use(errorableExpress(errors));
  app.use(validator.asConnect);

  app.use(filters);
  app.use(policies);

  // For weixin config
  app.use(skipper());
  var setter = weixinStorage(models.settings);
  var setterId = weixinStorageId(models.settings);
  var weixinSettings = weixinSettingsFunc.get(setter);
  app.use(function (req, res, next) {
    console.log(req.path);
    if (/^\/weixin\/api\/.*$/.test(req.path)) {
      req.__weixinSettings = weixinSettingsIdFunc.get(setterId, req);
    } else {
      req.__weixinSettings = weixinSettingsFunc.get(setter, req);
    }
    next();
  });

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

  // 以ID为关联
  weixinRouter.express(weixinSettings, weixinSession, app, '/weixin/api/:id');
  weixinRouter.getId = function (req, next) {
    next(req.params.id || '-1');
  };
  weixinConfig.set.set(weixinSettings, app, function callback(req, res, id, value) {
    res.errorize(res.errors.Success, value);
  }, function (req) {
    console.log(req.body);
    return getId(req, true);
  },
    'xxx', // 忽略
    '/weixin/config/:type' // 必须有:type, 包默认会处理
  );
};
