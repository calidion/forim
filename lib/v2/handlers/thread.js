var config = require('../../config');
var isLogin = require('../policies/isLogin');
module.exports = [{
  urls: ['/my/messages', '/v2/user/messages'],
  routers: {
    get: function (req, res) {
      var user = req.session.user;
      var Message = req.models.Message;
      var read = Message.find({
        isRead: true
      }).populate('sender').populate('thread').populate('replier');
      var unread = Message.find({
        isRead: true
      }).populate('sender').populate('thread').populate('replier');

      Promise.all([read, unread]).then(function (messages) {
        return unread.map(function (item) {
          return {
            id: item.id
          };
        });
      }).then(function (ids) {
        return Message.update(ids, {
          isRead: true
        });
      }).then(function (updated) {
        res.render('message/index', {
          read: read,
          unread: unread
        });
      }).catch(function (err) {
        res.status(500).send(err);
      });
    }
  },
  policies: {
    get: isLogin
  }
}];
