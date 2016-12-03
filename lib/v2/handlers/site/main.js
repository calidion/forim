
var paginator = require('waterline-paginator');
var config = require('../../../config');

module.exports = {
  urls: [
    '/'
  ],
  routers: {
    get: function (req, res) {
      var extracted = req.extracted || {};
      var query = extracted.query || req.query || {};
      var page = query.page > 0 ? query.page : 1;
      var limit = query.limit || config.list_topic_count;
      var tab = query.tab || '';
      var User = req.models.User;
      var Thread = req.models.Thread;
      var tabName = '';
      if (tab && tab === 'all') {
        tab = '';
      } else {
        tabName = config.tabs.filter(function (item) {
          return item[0] === tab;
        });
        if (tabName) {
          tabName = tabName[1];
        }
      }

      Promise.all([
        User.find({
          isBlocked: false,
          limit: 10
        }).sort({
          score: 'desc'
        }).limit(10),
        Thread.find({
          replies: 0,
          limit: 5
        }).sort({
          createdAt: 'desc'
        }),
        new Promise(function (resolve, reject) {
          paginator.paginate({
            model: Thread,
            limit: limit,
            page: page,
            sorts: ['top asc', 'lastReplyAt desc'],
            populates: [
              'author',
              'lastReplier'
            ]
          }, function (err, result) {
            if (err) {
              reject(err);
            } else {
              resolve(result);
            }
          });
        })
      ]).then(function (data) {
        var result = data[2];
        res.render('index', {
          threads: result.results,
          page: page,
          limit: limit,
          users: data[0],
          posts: data[1],
          total: result.total,
          tabs: config.tabs,
          tab: tab,
          title: tabName && (tabName + '版块')
        });
      }).catch(function (err) {
        console.error(err);
        res.render('notify/notify', {
          error: '系统出错，请稍候再试'
        });
      });
    }
  },
  validations: {
    get: {
      query: {
        page: {
          type: 'int'
        },
        tab: {
          type: 'string'
        }
      }
    }
  }
};
