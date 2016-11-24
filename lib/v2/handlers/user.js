var paginator = require('waterline-paginator');
var callbacks = require('../util/callbacks');
var isAdmin = require('../policies/isAdmin');
module.exports = [
  {
    prefix: '/v2/users',
    urls: ['/v2/users'],
    routers: {
      methods: ['all'],
      all: function (req, res) {
        console.log('inside v2 users');
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
      methods: ['all'],
      all: isAdmin
    }
  }, {
    urls: ['/v2/users/:id'],
    routers: {
      methods: ['all'],
      all: function (req, res) {
        var id = req.params.id;
        req.models.User.findOne({
          id: id
        }).then(callbacks.idData(res)).fail(callbacks.failed(res));
      }
    },
    policies: {
      methods: ['all'],
      all: isAdmin
    }
  }
];
