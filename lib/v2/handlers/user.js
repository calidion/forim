var callbacks = require('../util/callbacks');
var register = require('./user/register');
var login = require('./user/login');
var logout = require('./user/logout');
var list = require('./user/list');
var profile = require('./user/profile');
var page = require('./user/page');
var settings = require('./user/settings');

var activate = require('./user/activate');

module.exports = [list, profile, page,
  settings, {
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
  },
  register, login, logout, activate
];
