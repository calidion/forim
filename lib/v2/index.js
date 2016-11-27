/**
 * Copyright(c) 2016 calidion <calidion@gmail.com>
 * Apache 2.0 Licensed
 */

var routers = require('./routers');
var vig = require('vig');
var errors = require('./errors');
var userHandlers = require('./handlers/user');
var settingsHandlers = require('./handlers/settings');
var passwordHandlers = require('./handlers/password');
var oauthHandlers = require('./handlers/oauth');
var searchHandlers = require('./handlers/search');
var messageHandlers = require('./handlers/message');
var oauth = require('./oauth');

module.exports = function (config, app, cb) {
  var path = require('path');
  var dir = path.resolve(__dirname, './models/');
  vig.models.addDir(dir);
  vig.models.init(config, {
    connection: 'default'
  }, function (error, models) {
    if (error) {
      throw error;
    }
    vig.init(app, errors);
    routers(app, models);
    app.models = models;
    oauth(app);
    vig.addHandlers(app, userHandlers);
    vig.addHandlers(app, settingsHandlers);
    vig.addHandlers(app, passwordHandlers);
    vig.addHandlers(app, oauthHandlers);
    vig.addHandlers(app, searchHandlers);
    vig.addHandlers(app, messageHandlers);
    cb(error);
  });
};
