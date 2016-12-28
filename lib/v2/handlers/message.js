var isLogin = require('../policies/isLogin');
var message = require('../sharable/message');
module.exports = [{
  urls: ['/my/messages', '/v2/user/messages'],
  routers: {
    get: function (req, res) {
      var user = req.session.user;
      var Message = req.models.Message;
      var myMessage = message.myMessage(Message, user);

      myMessage.then(function (result) {
        res.showPage('message/index', {
          read: result[0],
          unread: result[1]
        });
      }).catch(function (err) {
        console.error(err);
        res.status(500).send(err);
      });
    }
  },
  policies: {
    get: isLogin
  }
}];
