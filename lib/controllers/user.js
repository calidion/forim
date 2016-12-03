var User = require('../proxy').User;
var Topic = require('../proxy').Topic;
var Reply = require('../proxy').Reply;
var TopicCollect = require('../proxy').TopicCollect;
var utility = require('utility');
var util = require('util');
var TopicModel = require('../models').Topic;
var ReplyModel = require('../models').Reply;
var tools = require('../common/tools');
var config = require('../config');
var EventProxy = require('eventproxy');
var validator = require('validator');
var _ = require('lodash');

exports.deleteAll = function (req, res, next) {
  var loginname = req.params.name;

  var ep = EventProxy.create();
  ep.fail(next);

  User.getUserByLoginName(loginname, ep.done(function (user) {
    if (!user) {
      return next(new Error('user is not exists'));
    }
    ep.all('del_topics', 'del_replys', 'del_ups',
      function () {
        res.json({
          status: 'success'
        });
      });
    // 删除主题
    TopicModel.update({
      author_id: user._id
    }, {
        $set: {
          deleted: true
        }
      }, {
        multi: true
      }, ep.done('del_topics'));
    // 删除评论
    ReplyModel.update({
      author_id: user._id
    }, {
        $set: {
          deleted: true
        }
      }, {
        multi: true
      }, ep.done('del_replys'));
    // 点赞数也全部干掉
    ReplyModel.update({}, {
      $pull: {
        ups: user._id
      }
    }, {
        multi: true
      }, ep.done('del_ups'));
  }));
};
