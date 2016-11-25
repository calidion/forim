var callbacks = require('../util/callbacks');
var isAdmin = require('../policies/isAdmin');
var register = require('./user/register');
var login = require('./user/login');
var list = require('./user/list');
var activate = require('./user/activate');

module.exports = [list, {
  prefix: '/v2/user/profile',
  urls: ['/:id'],
  routers: {
    all: function (req, res) {
      var id = req.params.id;
      req.models.User.findOne({
        id: id
      }).then(callbacks.idData(res)).fail(callbacks.failed(res));
    }
  },
  policies: {
    all: isAdmin
  }
}, {
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
}, register, login, activate];
