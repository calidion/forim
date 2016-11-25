var callbacks = require('../util/callbacks');
var register = require('./user/register');
var login = require('./user/login');
var logout = require('./user/logout');
var list = require('./user/list');
var profile = require('./user/profile');
var activate = require('./user/activate');

module.exports = [list, profile, {
  prefix: '/v2/user/name',
  urls: ['/:username'],
  routers: {
    all: function (req, res) {
      var username = req.params.username;
      req.models.User.findOne({
        username: username
      }).then(function (user) {
        if (!user) {
          return res.errorize(req.errors.UserNotFound, {
            username: username
          });
        }
      }).fail(callbacks.failed(res));
    }
  }
}, register, login, logout, activate];
