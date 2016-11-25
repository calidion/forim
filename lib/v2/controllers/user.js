var paginator = require('waterline-paginator');
var callbacks = require('../util/callbacks');

module.exports = function (model) {
  return {
    list: function (req, res) {
      var limit = req.query.limit;
      var page = req.query.page;
      paginator.paginate({
        model: model,
        limit: limit,
        page: page
      }, callbacks.listData(res));
    },
    register: function (req, res) {
      var extracted = req.extracted;
      var user = {
        username: extracted.loginname,
        emaile: extracted.email
      };
      var User = req.models.User;

      User.findOne({
        or: [{
          username: extracted.username
        }, {
          email: extracted.email
        }]
      }).then(function (found) {
        if (found) {
          res.errorize(res.errors.UserExisted);
          return;
        }
        return Promise.resolve(User.create(user)
        .then(function () {
          res.errorize(res.errors.Success, user);
        }));
      }).failed(callbacks.failed(res));
    }
  };
};
