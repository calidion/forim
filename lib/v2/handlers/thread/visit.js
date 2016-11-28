var isLogin = require('../../policies/isLogin');
var at = require('../../util/at');
var config = require('../../../config');

function onError(err, req, res, extracted) {
  res.status(403);
  return res.render('thread/edit', {
    error: err,
    title: extracted.title,
    content: extracted.content,
    tabs: config.tabs
  });
}

module.exports = {
  urls: [
    '/thread/visit/:id',
    '/v2/thread/:id'
  ],
  routers: {
    get: function (req, res) {
      var Thread = req.models.Thread;
      var User = req.models.User;
      var extracted = req.extracted.params;
      Thread.findOne({
          id: extracted.id,
          isDeleted: false
        })
        .populate('author')
        .populate('posts')
        .then(function (thread) {
          if (!thread) {
            return res.status(404)
              .render('notify/notify', {
                error: '此话题不存在或已被删除。'
              });
          }
          thread.visits++;
          Promise.all([
            Thread.find({
              author: thread.author.id
            }),
            Thread.find({
              repliers: 0
            }),
          ]).then(function (data) {
            res.render('thread/index', {
              thread: thread,
              others: data[0],
              replies: data[1]
            });;
          }).catch(function (err) {
            console.error(err);
          });
        }).fail(function (err) {
          console.error(err);
          onError(err, req, res, extracted);
        });
    }
  },
  validations: {
    get: {
      params: {
        id: {
          type: 'string',
          required: true
        }
      }
    }
  }
};
