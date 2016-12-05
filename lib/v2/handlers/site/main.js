
var config = require('../../../config');
var userShared = require('../../sharable/user');
var threadShared = require('../../sharable/thread');

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
        userShared.highestscored(User),
        threadShared.unanswered(Thread),
        threadShared.paginated(Thread, limit, page)
      ]).then(function (data) {
        var result = data[2];
        res.showPage('index', {
          threads: result.results,
          page: page,
          limit: limit,
          highestScores: data[0],
          unanswered: data[1],
          total: result.total,
          tabs: config.tabs,
          tab: tab,
          title: tabName && (tabName + '版块')
        });
      }).catch(function (err) {
        console.error(err);
        res.showPage('notify/notify', {
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
