/**
 * Forim - User Router
 * Copyright(c) 2016 calidion <calidion@gmail.com>
 * Apache 2.0 Licensed
 */

var _ = require('lodash');
var common = require('errorable-common');
var errorable = require('errorable');
var Generator = errorable.Generator;

common = _.merge(common, require('./errors/friend'));
common = _.merge(common, require('./errors/message'));
common = _.merge(common, require('./errors/user'));
common = _.merge(common, require('./errors/email'));

var errors = new Generator(common, 'zh-CN').errors;
module.exports = errors;
