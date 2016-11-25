var callbacks = require('../../util/callbacks');
var isAdmin = require('../../policies/isAdmin');
module.exports = {
  urls: [
    '/v2/user/profile/:id',
    '/v2/user/name/:username',
    '/user/:username'
  ],
  routers: {
    all: function (req, res) {
      var id = req.params.id;
      var username = req.params.username;
      var query = {};
      if (id) {
        query.id = id;
      }
      if (username) {
        query.username = username;
      }
      req.models.User.findOne(query)
        .then(callbacks.idData(res))
        .fail(callbacks.failed(res));
    }
  },
  policies: {
    all: isAdmin
  }
};
