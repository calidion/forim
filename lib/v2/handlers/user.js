var callbacks = require('../util/callbacks');
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
  'page', 'profile', 'register', 'settings', 'star', 'top',
  'clear', 'detail', 'search'];
for (var i = 0; i < requires.length; i++) {
  modules = modules.concat(require('./user/' + requires[i]));
}
module.exports = modules;

