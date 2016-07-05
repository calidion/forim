// var filter = require('../filters/settings');
var config = require('node-weixin-express-config');
var template = require('../util/template');
// var config = require('../../config');

module.exports = {
  // update: function (model, req, next) {
  //   var type = req.query.type;
  // },
  onPages: function (req, res) {
    var type = req.query.type;
    if (['app', 'message', 'merchant',
      'certificate', 'server', 'urls',
      'oauth', 'pages'].indexOf(type) === -1) {
      type = 'app';
    }
    var user = req.session.user;
    var data = template.render('settings/weixin/' + type + '.njk', {
      type: type,
      title: '微信设定',
      googleTrackerId: config.google_tracker_id,
      user: {
        name: user.name,
        avatar: user.avatar,
        id: user._id
      }
    });
    res.send(data);
  }
};
