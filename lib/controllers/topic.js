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


/**
 * Topic page
 *
 * @param  {HttpRequest} req
 * @param  {HttpResponse} res
 * @param  {Function} next
 */
exports.index = function (req, res, next) {
  function isUped(user, reply) {
    if (!reply.ups) {
      return false;
    }
    return reply.ups.indexOf(user._id) !== -1;
  }

  var topic_id = req.params.tid;
  if (topic_id.length !== 24) {
    return res.render404('此话题不存在或已被删除。');
  }
  var events = ['topic', 'other_topics', 'no_reply_topics'];
  var ep = EventProxy.create(events, function (topic, other_topics, no_reply_topics) {
    res.render('topic/index', {
      topic: topic,
      author_other_topics: other_topics,
      no_reply_topics: no_reply_topics,
      is_uped: isUped
    });
  });

  ep.fail(next);

  Topic.getFullTopic(topic_id, ep.done(function (message, topic, author, replies) {
    if (message) {
      ep.unbind();
      return res.renderError(message);
    }

    topic.visit_count += 1;
    topic.save();

    topic.author = author;
    topic.replies = replies;

    // 点赞数排名第三的回答，它的点赞数就是阈值
    topic.reply_up_threshold = (function () {
      var allUpCount = replies.map(function (reply) {
        return reply.ups && reply.ups.length || 0;
      });
      allUpCount = _.sortBy(allUpCount, Number).reverse();

      var threshold = allUpCount[2] || 0;
      if (threshold < 3) {
        threshold = 3;
      }
      return threshold;
    })();

    ep.emit('topic', topic);

    // get other_topics
    var options = { limit: 5, sort: '-last_reply_at' };
    var query = { author_id: topic.author_id, _id: { $nin: [topic._id] } };
    Topic.getTopicsByQuery(query, options, ep.done('other_topics'));

    // get no_reply_topics
    cache.get('no_reply_topics', ep.done(function (no_reply_topics) {
      if (no_reply_topics) {
        ep.emit('no_reply_topics', no_reply_topics);
      } else {
        Topic.getTopicsByQuery(
          { reply_count: 0, tab: { $ne: 'job' } },
          { limit: 5, sort: '-create_at' },
          ep.done('no_reply_topics', function (no_reply_topics) {
            cache.set('no_reply_topics', no_reply_topics, 60 * 1);
            return no_reply_topics;
          }));
      }
    }));
  }));
};

exports.delete = function (req, res) {
  // 删除话题, 话题作者topic_count减1
  // 删除回复，回复作者reply_count减1
  // 删除topic_collect，用户collect_topic_count减1

  var topic_id = req.params.tid;

  Topic.getTopic(topic_id, function (err, topic) {
    if (err) {
      return res.send({ success: false, message: err.message });
    }
    if (!req.session.user.is_admin && !(topic.author_id.equals(req.session.user._id))) {
      res.status(403);
      return res.send({ success: false, message: '无权限' });
    }
    if (!topic) {
      res.status(422);
      return res.send({ success: false, message: '此话题不存在或已被删除。' });
    }
    topic.deleted = true;
    topic.save(function (err) {
      if (err) {
        return res.send({ success: false, message: err.message });
      }
      res.send({ success: true, message: '话题已被删除。' });
    });
  });
};

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

// 收藏主题
// exports.collect = function (req, res, next) {
//   var topic_id = req.body.topic_id;
//   Topic.getTopic(topic_id, function (err, topic) {
//     if (err) {
//       return next(err);
//     }
//     if (!topic) {
//       res.json({ status: 'failed' });
//     }

//     TopicCollect.getTopicCollect(req.session.user._id, topic._id, function (err, doc) {
//       if (err) {
//         return next(err);
//       }
//       if (doc) {
//         res.json({ status: 'success' });
//         return;
//       }

//       TopicCollect.newAndSave(req.session.user._id, topic._id, function (err) {
//         if (err) {
//           return next(err);
//         }
//         res.json({ status: 'success' });
//       });
//       User.getUserById(req.session.user._id, function (err, user) {
//         if (err) {
//           return next(err);
//         }
//         user.collect_topic_count += 1;
//         user.save();
//       });

//       req.session.user.collect_topic_count += 1;
//       topic.collect_count += 1;
//       topic.save();
//     });
//   });
// };

// exports.de_collect = function (req, res, next) {
//   var topic_id = req.body.topic_id;
//   Topic.getTopic(topic_id, function (err, topic) {
//     if (err) {
//       return next(err);
//     }
//     if (!topic) {
//       res.json({ status: 'failed' });
//     }
//     TopicCollect.remove(req.session.user._id, topic._id, function (err) {
//       if (err) {
//         return next(err);
//       }
//       res.json({ status: 'success' });
//     });

//     User.getUserById(req.session.user._id, function (err, user) {
//       if (err) {
//         return next(err);
//       }
//       user.collect_topic_count -= 1;
//       user.save();
//     });

//     topic.collect_count -= 1;
//     topic.save();

//     req.session.user.collect_topic_count -= 1;
//   });
// };

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
