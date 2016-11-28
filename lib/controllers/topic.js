/*!
 * nodeclub - controllers/topic.js
 */

/**
 * Module dependencies.
 */

var validator = require('validator');
var at = require('../common/at');
var User = require('../proxy').User;
var Topic = require('../proxy').Topic;
var TopicCollect = require('../proxy').TopicCollect;
var EventProxy = require('eventproxy');
// var store = require('../common/store');
var config = require('../config');
var _ = require('lodash');
var cache = require('../common/cache');

// 设为置顶
exports.top = function (req, res, next) {
  var topic_id = req.params.tid;
  var referer = req.get('referer');

  if (topic_id.length !== 24) {
    res.render404('此话题不存在或已被删除。');
    return;
  }
  Topic.getTopic(topic_id, function (err, topic) {
    if (err) {
      return next(err);
    }
    if (!topic) {
      res.render404('此话题不存在或已被删除。');
      return;
    }
    topic.top = !topic.top;
    topic.save(function (err) {
      if (err) {
        return next(err);
      }
      var msg = topic.top ? '此话题已置顶。' : '此话题已取消置顶。';
      res.render('notify/notify', { success: msg, referer: referer });
    });
  });
};

// 设为精华
exports.good = function (req, res, next) {
  var topicId = req.params.tid;
  var referer = req.get('referer');

  Topic.getTopic(topicId, function (err, topic) {
    if (err) {
      return next(err);
    }
    if (!topic) {
      res.render404('此话题不存在或已被删除。');
      return;
    }
    topic.good = !topic.good;
    topic.save(function (err) {
      if (err) {
        return next(err);
      }
      var msg = topic.good ? '此话题已加精。' : '此话题已取消加精。';
      res.render('notify/notify', { success: msg, referer: referer });
    });
  });
};

// 锁定主题，不可再回复
exports.lock = function (req, res, next) {
  var topicId = req.params.tid;
  var referer = req.get('referer');
  Topic.getTopic(topicId, function (err, topic) {
    if (err) {
      return next(err);
    }
    if (!topic) {
      res.render404('此话题不存在或已被删除。');
      return;
    }
    topic.lock = !topic.lock;
    topic.save(function (err) {
      if (err) {
        return next(err);
      }
      var msg = topic.lock ? '此话题已锁定。' : '此话题已取消锁定。';
      res.render('notify/notify', { success: msg, referer: referer });
    });
  });
};

exports.upload = function (req, res, next) {
  var isFileLimit = false;
  req.busboy.on('file', function (fieldname, file) {
    file.on('limit', function () {
      isFileLimit = true;
      res.json({
        success: false,
        msg: 'File size too large. Max is ' + config.file_limit
      });
    });
    var uploader = require('../v2/util/uploader');
    uploader(config.uploader, file, fieldname, function (result) {
      if (result.error) {
        return next(result.error);
      }
      if (isFileLimit) {
        return;
      }
      var json = {
        success: true,
        url: result.url
      };
      res.json(json);
    });
  });

  req.pipe(req.busboy);
};
