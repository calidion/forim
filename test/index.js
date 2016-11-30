'use strict';

// var forim = require('../lib');
var app = require('./app.test.js');
var env = require('./env');

var api = require('./api/');
var common = require('./common/');
var controllers = require('./controllers/');

describe('forim', function () {
  require('./v2/');
});
