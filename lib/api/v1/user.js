var _ = require('lodash');
var EventProxy = require('eventproxy');
var UserProxy = require('../../proxy').User;
var TopicProxy = require('../../proxy').Topic;
var ReplyProxy = require('../../proxy').Reply;

var show = function (req, res, next) {
  var loginname = req.params.loginname;
  var ep = new EventProxy();

  ep.fail(next);

  UserProxy.getUserByLoginName(loginname, ep.done(function (user) {
    if (!user) {
      return res.send({ error_msg: 'user `' + loginname + '` is not exists' });
    }
    var query = { author_id: user._id };
    var opt = { limit: 5, sort: '-create_at' };
    TopicProxy.getTopicsByQuery(query, opt, ep.done('recent_topics'));

    ReplyProxy.getRepliesByAuthorId(user._id, { limit: 20, sort: '-create_at' },
      ep.done(function (replies) {
        var topicIds = [];
        for (var i = 0; i < replies.length; i++) {
          if (topicIds.indexOf(replies[i].topic_id.toString()) < 0) {
            topicIds.push(replies[i].topic_id.toString());
          }
        }
        var query = { _id: { $in: topicIds } };
        var opt = { limit: 5, sort: '-create_at' };
        TopicProxy.getTopicsByQuery(query, opt, ep.done('recent_replies'));
      }));

    ep.all('recent_topics', 'recent_replies',
      function (recentTopics, recentReplies) {
        user = _.pick(user, ['loginname', 'avatar_url', 'githubUsername',
          'create_at', 'score']);

        user.recent_topics = recentTopics.map(function (topic) {
          topic.author = _.pick(topic.author, ['loginname', 'avatar_url']);
          topic = _.pick(topic, ['id', 'author', 'title', 'last_reply_at']);
          return topic;
        });
        user.recent_replies = recentReplies.map(function (topic) {
          topic.author = _.pick(topic.author, ['loginname', 'avatar_url']);
          topic = _.pick(topic, ['id', 'author', 'title', 'last_reply_at']);
          return topic;
        });

        res.send({ data: user });
      });
  }));
};

exports.show = show;
