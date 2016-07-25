/**
 * Copyright(c) 2016 calidion <calidion@gmail.com>
 * Apache 2.0 Licensed
 */

var callbacks = require('../util/callbacks');

module.exports = function (User) {
  var router = require('express').Router;
  var user = router();

  user.all('/', callbacks.list(User));
  user.all('/:id', callbacks.id(User, 'admin'));
  return user;
};
