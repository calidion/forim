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
      var data = req.validate(req.body, req.__filters.user.register);
      if (!data || data.code !== 0) {
        return res.errorize(res.errors.InputInvalid);
      }
      var user = data.data;
      model.findOne({
        or: [
          {
            username: user.username
          }, {
            email: user.email
          }
        ]
      }).then(function (found) {
        if (found) {
          res.errorize(res.errors.UserExisted, user);
          return Promise.resolve(0);
        }
        return Promise.resolve(model.create(data).then(function (user) {
          res.errorize(res.errors.Success, user);
        }));
      }).failed(callbacks.failed(res));
    }
  };
};
