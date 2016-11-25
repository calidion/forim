var paginator = require('waterline-paginator');
var callbacks = require('../util/callbacks');
var isAdmin = require('../policies/isAdmin');
module.exports = [{
  prefix: '/v2/users',
  urls: ['/'],
  routers: {
    all: function (req, res) {
      var limit = req.query.limit;
      var page = req.query.page;
      paginator.paginate({
        model: req.models.User,
        limit: limit,
        page: page
      }, callbacks.listData(res));
    }
  },
  policies: {
    all: isAdmin
  }
}, {
  prefix: '/v2/users',
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
  prefix: '/users',
  urls: ['/name/:username'],
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
