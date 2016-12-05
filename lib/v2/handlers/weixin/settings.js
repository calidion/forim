var paginator = require('waterline-paginator');

var isLogin = require('../../policies/isLogin');
var isAdmin = require('../../policies/isAdmin');

var settings = require('../../controllers/settings');
var callbacks = require('../../util/callbacks');
var filter = require('../../filters/settings');

module.exports = [{
  prefix: '/v2/weixin/settings',
  urls: ['/'],
  routers: {
    get: function (req, res) {
      var limit = req.query.limit;
      var page = req.query.page;
      var Settings = req.models.Settings;
      paginator.paginate({
        model: Settings,
        limit: limit,
        page: page,
        populates: ['user']
      }, callbacks.listData(res));
    },
    post: function (req, res) {
      var action = req.body.action;
      if (action === 'delete') {
        settings.onClear(req, res);
      }
    }
  },
  policies: {
    all: isAdmin
  },
  validations: {
    post: {
      body: {
        action: {
          required: true,
          type: 'string'
        }
      }
    }
  }
}, {
  prefix: '/v2/weixin/settings',
  urls: ['/user'],
  routers: {
    get: function (req, res) {
      // var app = req.query.app;
      settings.onConfig(req, res);

      // switch (app) {
      //   case 'message':
      //     settings.onMessage(req, res);
      //     break;
      //   default:
      //     settings.onConfig(req, res);
      //     break;
      // }
    },
    post: function (req, res) {
      var action = req.body.action;
      switch (action) {
        case 'create':
        case 'add':
          var userSettings = {
            user: req.session.user.id,
            key: req.extracted.body.key,
            value: req.extracted.body.value
          };
          var Settings = req.models.Settings;
          Settings.create(userSettings)
            .then(callbacks.success(res))
            .fail(callbacks.failed(res));
          break;
        case 'id':
          settings.onWeixinId(req, res);
          break;
        default:
          res.status(404).send('Not Found!');
          break;
      }
    }
  },
  validations: {
    post: function (req, res, next) {
      var action = req.body.action;
      switch (action) {
        case 'create':
        case 'add':
          // var settings = require('../filters/settings');
          var data = req.validate(req.body, filter.create);
          if (!data || data.code !== 0) {
            return res.errorize(res.errors.InputInvalid);
          }
          req.extracted = {
            body: data.data
          };
          break;
        default:
          break;
      }
      next(true);
    }
  },
  policies: {
    all: isLogin
  },
  failures: {
    policy: function (data, req, res) {
      res.redirect('/signin');
    }
  }
}, {
  prefix: '/v2/weixin/settings',
  urls: ['/:id'],
  routers: {
    get: function (req, res) {
      var id = req.params.id;
      var Settings = req.models.Settings;
      Settings.findOne({
        id: id
      }).then(function (settings) {
        if (!settings) {
          return res.errorize(res.errors.NotFound);
        }
        res.errorize(res.errors.Success, settings);
      }).fail(callbacks.failed(res));
    }
  },
  policies: {
    all: isAdmin
  }
}];
