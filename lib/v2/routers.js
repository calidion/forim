/**
 * Forim - User Router
 * Copyright(c) 2016 calidion <calidion@gmail.com>
 * Apache 2.0 Licensed
 */

module.exports = function (app, models) {

  // Init Errorable

  var errorableExpress = require('errorable-express');
  var errors = require('./errors');
  app.use(errorableExpress(errors));

  // Init routers
  var userRouter = require('./routers/user');
  var user = userRouter(models.user);

  var settingsRouter = require('./routers/settings');
  var settings = settingsRouter(models.settings);

  app.use('/v2/users', user);
  app.use('/v2/settings', settings);
};
