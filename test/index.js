'use strict';

var should = require('should');

describe('forim', function () {
  require('./v2/github');
  require('./v2/user');
  require('./v2/message');
  require('./v2/thread');
  require('./v2/post');
  require('./v2/file');
  require('./v2/password');
  require('./v2/util/at');
  require('./v2/settings');
  require('./v2/mailer');
  require('./v2/site');
  require('./v2/weixin/settings');
  require('./v2/weixin/pages');
  require('./v2/weixin/api');
  require('./v2/weixin/settings.func');
});
