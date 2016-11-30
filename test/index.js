'use strict';

// var forim = require('../lib');
var app = require('./app.test.js');
var env = require('./env');

var api = require('./api/');
var common = require('./common/');
var controllers = require('./controllers/');

describe('forim', function () {
  require('./v2/github');
  require('./v2/user');
  require('./v2/message');
  require('./v2/thread');
  require('./v2/file');
  require('./v2/util/at');
  require('./v2/settings');
  require('./v2/express');
  require('./v2/mailer');
  require('./v2/weixin/settings');
  require('./v2/weixin/pages');
  require('./v2/weixin/api');
  require('./v2/weixin/settings.func');
});
