var template = require('../util/template');
var config = require('../../config');
var types = ['app', 'message', 'merchant',
  'certificate', 'server', 'urls',
  'oauth', 'pages'
];

var getId = require('../util/getId');
var callbacks = require('../util/callbacks');

var weixinStorageId = require('../weixin/storage.id');
var weixinStorage = require('../weixin/storage.session');

var weixinSettingsFunc = require('../weixin/settings.session');
var weixinSettingsIdFunc = require('../weixin/settings.id');

var thisModule = {
  onConfig: function (req, res) {
    var type = req.query.type;
    if (types.indexOf(type) === -1) {
      type = 'app';
    }
    var user = req.session.user;
    if (!req.__weixinSettings) {
      var setter = weixinStorage(req.models.Settings);
      var setterId = weixinStorageId(req.models.Settings);
      if (/^\/weixin\/api\/.*$/.test(req.path)) {
        req.__weixinSettings = weixinSettingsIdFunc.get(setterId, req);
      } else {
        req.__weixinSettings = weixinSettingsFunc.get(setter, req);
      }
    }
    req.__weixinSettings.get(user._id,
      type,
      function (value) {
        var html = template.render('settings/weixin/config/' + type + '.njk', {
          host: req.headers.host,
          type: type,
          title: '微信设定',
          googleTrackerId: config.google_tracker_id,
          user: {
            name: user.name,
            avatar: user.avatar,
            id: user._id
          },
          data: value
        });
        res.send(html);
      }
    );
  },
  // onMessage: function (req, res) {
  //   var user = req.session.user;
  //   var Settings = req.models.Settings;
  //   Settings.findOne({
  //     user: user._id
  //   }).then(function (settings) {
  //     var html = template.render('settings/weixin/pages.njk', {
  //       host: req.headers.host,
  //       title: '消息页面',
  //       googleTrackerId: config.google_tracker_id,
  //       user: {
  //         name: user.name,
  //         avatar: user.avatar,
  //         id: user._id
  //       },
  //       url: req.hostname + '/weixin/api/' + settings.id
  //     });
  //     res.send(html);
  //   }).fail(callbacks.failed(res));
  // },
  onWeixinId: function (req, res) {
    var data = {
      user: String(getId(req))
    };
    var Settings = req.models.Settings;
    Settings.findOne(data).then(function (settings) {
      res.errorize(res.errors.Success, {
        id: settings.id
      });
    }).fail(callbacks.failed(res));
  },
  onClear: function (req, res) {
    var Settings = req.models.Settings;
    Settings.destroy().exec(function () {
      res.errorize(res.errors.Success);
    });
  }
};
module.exports = thisModule;
