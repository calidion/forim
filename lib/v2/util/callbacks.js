var paginator = require('waterline-paginator');
var callbacks = {
  idData: function (res) {
    return function (data) {
      if (!data) {
        return res.errorize(res.errors.NotFound);
      }
      res.errorize(res.errors.Success, data);
    };
  },
  id: function (model, permission) {
    return function (req, res) {
      req._isPermitted(permission, function () {
        var id = req.params.id;
        model.findOne({
          id: id
        }).then(callbacks.idData(res)).fail(callbacks.failed(res));
      });
    };
  },
  listData: function (res) {
    return function (error, data) {
      if (error) {
        return res.errorize(res.errors.Failed, {
          error: error,
          data: data
        });
      }
      res.errorize(res.errors.Success, data);
    };
  },
  list: function (model) {
    return function (req, res) {
      req._isPermitted('admin', function () {
        var limit = req.query.limit;
        var page = req.query.page;
        paginator.paginate({
          model: model,
          limit: limit,
          page: page
        }, callbacks.listData(res));
      });
    };
  },
  failed: function (res) {
    return function (error) {
      return res.errorize(res.errors.Failed, error);
    };
  },
  success: function (res) {
    return function (data) {
      res.errorize(res.errors.Success, data);
    };
  }
};

module.exports = callbacks;
