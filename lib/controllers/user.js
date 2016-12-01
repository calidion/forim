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

exports.listCollectedTopics = function (req, res, next) {
  var name = req.params.name;
  User.getUserByLoginName(name, function (err, user) {
    if (err || !user) {
      return next(err);
    }

    var page = Number(req.query.page) || 1;
    var limit = config.list_topic_count;

    var render = function (topics, pages) {
      res.render('user/collect_topics', {
        topics: topics,
        current_page: page,
        pages: pages,
        user: user
      });
    };

    var proxy = EventProxy.create('topics', 'pages', render);
    proxy.fail(next);

    TopicCollect.getTopicCollectsByUserId(user._id, proxy.done(function (docs) {
      var ids = [];
      for (var i = 0; i < docs.length; i++) {
        ids.push(docs[i].topic_id);
      }
      var query = {
        _id: {
          $in: ids
        }
      };
      var opt = {
        skip: (page - 1) * limit,
        limit: limit,
        sort: '-create_at'
      };
      Topic.getTopicsByQuery(query, opt, proxy.done('topics'));
      Topic.getCountByQuery(query, proxy.done(function (all_topics_count) {
        var pages = Math.ceil(all_topics_count / limit);
        proxy.emit('pages', pages);
      }));
    }));
  });
};

exports.top100 = function (req, res, next) {
  var opt = {
    limit: 100,
    sort: '-score'
  };
  User.getUsersByQuery({
    is_block: false
  }, opt, function (err, tops) {
    if (err) {
      return next(err);
    }
    res.render('user/top100', {
      users: tops,
      pageTitle: 'top100',
    });
  });
};

exports.listTopics = function (req, res, next) {
  var username = req.params.name;
  var page = Number(req.query.page) || 1;
  var limit = config.list_topic_count;

  User.getUserByLoginName(username, function (err, user) {
    if (!user) {
      res.render404('这个用户不存在。');
      return;
    }

    var render = function (topics, pages) {
      res.render('user/topics', {
        user: user,
        topics: topics,
        current_page: page,
        pages: pages
      });
    };

    var proxy = new EventProxy();
    proxy.assign('topics', 'pages', render);
    proxy.fail(next);

    var query = {
      author_id: user._id
    };
    var opt = {
      skip: (page - 1) * limit,
      limit: limit,
      sort: '-create_at'
    };
    Topic.getTopicsByQuery(query, opt, proxy.done('topics'));

    Topic.getCountByQuery(query, proxy.done(function (all_topics_count) {
      var pages = Math.ceil(all_topics_count / limit);
      proxy.emit('pages', pages);
    }));
  });
};

exports.listReplies = function (req, res, next) {
  var username = req.params.name;
  var page = Number(req.query.page) || 1;
  var limit = 50;

  User.getUserByLoginName(username, function (err, user) {
    if (!user) {
      res.render404('这个用户不存在。');
      return;
    }

    var render = function (topics, pages) {
      res.render('user/replies', {
        user: user,
        topics: topics,
        current_page: page,
        pages: pages
      });
    };

    var proxy = new EventProxy();
    proxy.assign('topics', 'pages', render);
    proxy.fail(next);

    var opt = {
      skip: (page - 1) * limit,
      limit: limit,
      sort: '-create_at'
    };
    Reply.getRepliesByAuthorId(user._id, opt, proxy.done(function (replies) {
      // 获取所有有评论的主题
      var topicIds = replies.map(function (reply) {
        return reply.topic_id;
      });
      topicIds = _.uniq(topicIds);
      var query = {
        _id: {
          $in: topicIds
        }
      };
      Topic.getTopicsByQuery(query, {}, proxy.done('topics'));
    }));

    Reply.getCountByAuthorId(user._id, proxy.done('pages', function (count) {
      var pages = Math.ceil(count / limit);
      return pages;
    }));
  });
};

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
