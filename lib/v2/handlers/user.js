// var callbacks = require('../util/callbacks');
// var register = require('./user/register');
// var login = require('./user/login');
// var logout = require('./user/logout');
// var list = require('./user/list');
// var profile = require('./user/profile');
// var page = require('./user/page');
// var settings = require('./user/settings');
// var activate = require('./user/activate');

// module.exports = [list, profile, page,
//   settings, ,
//   register, login, logout, activate
// ];

var modules = [{
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
  }];
var requires = ['activate', 'block', 'list', 'login', 'logout',
 'page', 'profile', 'register', 'settings'];
for (var i = 0; i < requires.length; i++) {
  modules = modules.concat(require('./user/' + requires[i]));
}
module.exports = modules;
