'use strict';

// var forim = require('../lib');
var app = require('./app.test.js');
var env = require('./env');

var api = require('./api/');
var common = require('./common/');
var controllers = require('./controllers/');
var middlewares = require('./middlewares/');
var models = require('./models/user.test');

describe('forim', function () {
  require('./v2/waterline');
  require('./v2/user');
  require('./v2/settings');
  require('./v2/express');
  require('./v2/mailer');
  require('./v2/weixin/settings');
  require('./v2/weixin/pages');
  require('./v2/weixin/api');
  require('./v2/weixin/settings.func');

});
