/**
 * Forim - User Router
 * Copyright(c) 2016 calidion <calidion@gmail.com>
 * Apache 2.0 Licensed
 */
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
  // For weixin config
  var setter = weixinStorage(models.Settings);
  var setterId = weixinStorageId(models.Settings);
  var weixinSettings = weixinSettingsFunc.get(setter);
  app.use(function (req, res, next) {
    if (/^\/weixin\/api\/.*$/.test(req.path)) {
      req.__weixinSettings = weixinSettingsIdFunc.get(setterId, req);
    } else {
      req.__weixinSettings = weixinSettingsFunc.get(setter, req);
    }
    next();
  });

  // 以ID为关联
  weixinRouter.express(weixinSettings, weixinSession, app, '/weixin/api/:id');
  weixinRouter.getId = function (req, next) {
    next(req.params.id || '-1');
  };
  weixinConfig.set.set(weixinSettings, app, function callback(req, res, id, value) {
    res.errorize(res.errors.Success, value);
  }, function (req) {
    return getId(req, true);
  },
    'xxx', // 忽略
    '/weixin/config/:type' // 必须有:type, 包默认会处理
  );
};
