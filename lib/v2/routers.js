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

module.exports = function (app, models) {
  // Init Errorable

  app.use(errorableExpress(errors));
  app.use(validator.asConnect);

  app.use(filters);
  app.use(policies);


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
};
