module.exports = function (app, models) {
  var errorableExpress = require('errorable-express');
  var errors = require('./errors');
  app.use(errorableExpress(errors));

  // Init routers
  var userRouter = require('./routers/user');
  var user = userRouter(models.user);

  app.use('/v2/users', user);
};
