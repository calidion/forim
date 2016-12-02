var validator = require('validator');
var _ = require('lodash');
var at = require('../common/at');
var message = require('../common/message');
var EventProxy = require('eventproxy');
var User = require('../proxy').User;
var Topic = require('../proxy').Topic;
var Reply = require('../proxy').Reply;
var config = require('../config');

exports.up = function(req, res, next) {
  var replyId = req.params.reply_id;
  var userId = req.session.user._id;
  Reply.getReplyById(replyId, function(err, reply) {
    if (err) {
      return next(err);
    }
    if (reply.author_id.equals(userId) && !config.debug) {
      // 不能帮自己点赞
      res.send({
        success: false,
        message: '呵呵，不能帮自己点赞。',
      });
    } else {
      var action;
      reply.ups = reply.ups || [];
      var upIndex = reply.ups.indexOf(userId);
      if (upIndex === -1) {
        reply.ups.push(userId);
        action = 'up';
      } else {
        reply.ups.splice(upIndex, 1);
        action = 'down';
      }
      reply.save(function() {
        res.send({
          success: true,
          action: action
        });
      });
    }
  });
};
