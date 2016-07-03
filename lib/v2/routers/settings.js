/**
 * Forim - Settings Router
 * Copyright(c) 2016 calidion <calidion@gmail.com>
 * Apache 2.0 Licensed
 */

var paginator = require('waterline-paginator');
var settings = {
  __failed: function (res) {
    return function (error) {
      return res.errorize(res.errors.Failed, error);
    };
  },
  __allCallback: function (res) {
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
  __success: function (res) {
    return function (data) {
      res.errorize(res.errors.Success, data);
    };
  },
  __onCreate: function (data, model, res) {
    model.create(data).then(settings.__success(res)).fail(settings.__failed(res));
  },
  __onAction: function (model, req, res) {
    var action = req.body.action;
    switch (action) {
      case 'create':
      case 'add':
        var data = req.validate(req.body, req.__filters.settings.create);
        if (!data || data.code !== 0) {
          return res.errorize(res.errors.InputInvalid);
        }
        var userSettings = {
          user: req.session.user.id,
          key: data.data.key,
          value: data.data.value
        };
        settings.__onCreate(userSettings, model, res);
        break;
      default:
        res._notFound();
        break;
    }
  },
  onAll: function (Settings) {
    return function (req, res) {
      req._isPermitted('admin', function () {
        var limit = req.query.limit;
        var page = req.query.page;
        paginator.paginate({
          model: Settings,
          limit: limit,
          page: page,
          populates: ['user']
        }, settings.__allCallback(res));
      });
    };
  },
  onId: function name(Settings) {
    return function (req, res) {
      req._isPermitted('admin', function () {
        var id = req.params.id;
        Settings.findOne({
          id: id
        }).then(function (settings) {
          if (!settings) {
            return res.errorize(res.errors.NotFound);
          }
          res.errorize(res.errors.Success, settings);
        }).fail(settings.__failed(res));
      });
    };
  },
  onUser: function (Settings) {
    return function (req, res) {
      req._isPermitted('login', function () {
        var action = req.body.action;
        if (action) {
          return settings.__onAction(Settings, req, res);
        }
      });
    };
  }
};

module.exports = function (Settings) {
  var router = require('express').Router;
  var aRouter = router();
  aRouter.all('/user', settings.onUser(Settings));
  aRouter.all('/:id', settings.onId(Settings));
  aRouter.all('/', settings.onAll(Settings));

  return aRouter;
};

module.exports.settings = settings;
