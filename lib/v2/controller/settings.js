var template = require('../util/template');
var config = require('../../config');
var types = ['app', 'message', 'merchant',
  'certificate', 'server', 'urls',
  'oauth', 'pages'];

var getId = require('../util/getId');

var thisModule = {
  onPages: function (req, res) {
    var type = req.query.type;
    if (types.indexOf(type) === -1) {
      type = 'app';
    }
    var user = req.session.user;
    req.__weixinSettings.get(user._id,
      type,
      function (value) {
        console.log(value);
        var html = template.render('settings/weixin/' + type + '.njk', {
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
  onWeixinId: function (model, req, res) {
    var data = {
      key: req.body.key,
      user: String(getId(req))
    };
    model.findOne(data).then(function (settings) {
      console.log('error');
      res.errorize(res.errors.Success, {
        id: settings.id
      });
    }).fail(function (error) {
      console.log(error);
      res.errorize(res.errors.Failed, error);
    });
  },
  onClear: function (model, req, res) {
    model.destroy({}).then(function () {
      res.errorize(res.errors.Success);
    }).fail(thisModule.__onFailed(res));
  },
  __onFailed: function (res) {
    return function (error) {
      res.errorize(res.errors.Failed, error);
    };
  }
};
module.exports = thisModule;
