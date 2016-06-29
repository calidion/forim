/**
 * Forim - Settings Router
 * Copyright(c) 2016 calidion <calidion@gmail.com>
 * Apache 2.0 Licensed
 */

var paginator = require('waterline-paginator');
var policies = require('../policies');
var allCallback = function (res) {
  return function (error, data) {
    if (error) {
      return res.errorize(res.errors.Failed, {
        error: error,
        data: data
      });
    }
    res.errorize(res.errors.Success, data);
  };
};

var failed = function (res) {
  return function (error) {
    return res.errorize(res.errors.Failed, error);
  };
};

var idCallback = function (Settings) {
  return function (req, res) {
    var id = req.params.id;
    Settings.findOne({
      id: id
    }).then(function (settings) {
      if (!settings) {
        return res.errorize(res.errors.NotFound);
      }
      res.errorize(res.errors.Success, settings);
    }).fail(failed(res));
  };
};

// var onAction = function (Settings, req, res) {
//   var action = req.body.action;
//   var user = req.session.user;
//   switch (action) {
//     case 'add':
//       break;
//     default:
//       break;
//   }
// };

module.exports = function (Settings) {
  var router = require('express').Router;
  var settings = router();
  settings.all('/', policies.admin, function (req, res) {
    var limit = req.query.limit;
    var page = req.query.page;
    // var action = req.body.action;
    // if (action) {
    //   return onAction(Settings, req, res);
    // }
    paginator.paginate({
      model: Settings,
      limit: limit,
      page: page
    }, allCallback(res));
  });
  settings.all('/:id', policies.admin, idCallback(Settings));
  return settings;
};
module.exports.allCallback = allCallback;
module.exports.failed = failed;
