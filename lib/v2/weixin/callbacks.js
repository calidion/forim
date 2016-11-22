var template = require('../util/template');
// var eventHandler = require('./auth/events');
// var messageHandler = require('./auth/message');

module.exports = function (weixinRouter
  /* , models */
) {
  // function parseMessage(model, message, type, handler) {
  //   var func = handler[type];
  //   if (typeof func === 'function') {
  //     func(model, message);
  //   } else {
  //     console.error(type + ' Not Found!');
  //   }
  // }

  // function onAuthEvent(message) {
  //   console.info('on Auth Event');
  //   console.log(message);
  //   var Event = models.Event;
  //   parseMessage(Event, message, message.Event.toLowerCase(), eventHandler);
  //   Event.create({
  //     from: message.FromUserName,
  //     to: message.ToUserName,
  //     message: message,
  //     event: message.Event
  //   }).then(function (ev) {
  //     console.log('event saved');
  //     console.log(ev);
  //   }).failed(function (e) {
  //     console.log(e);
  //   });
  // }

  // function onAuthMessage(message) {
  //   console.info('on Auth Message');
  //   console.log(message);
  //   var Message = models.Message;

  //   parseMessage(Message, message, message.MsgType.toLowerCase(), messageHandler);
  //   Message.create({
  //     from: message.FromUserName,
  //     to: message.ToUserName,
  //     message: message,
  //     event: message.MsgType
  //   }).then(function (ev) {
  //     console.log('message saved');
  //     console.log(ev);
  //   }).failed(function (e) {
  //     console.log(e);
  //   });
  // }

  function onOAuthAccess() {
    console.info('on OAuth access');
  }

  function onOAuthSuccess(req, res, data) {
    console.info('on OAuth Success');
    var html = template.render('weixin/oauth.html', data);
    res.send(html);
  }
  // weixinRouter.onAuthEvent(onAuthEvent);
  // weixinRouter.onAuthMessage(onAuthMessage);
  weixinRouter.onOauthAccess(onOAuthAccess);
  weixinRouter.onOauthSuccess(onOAuthSuccess);
};
