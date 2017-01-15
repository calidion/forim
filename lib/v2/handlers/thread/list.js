var config = require('../../../config');
var threadShared = require('../../sharable/thread');

module.exports = {
  urls: [
    '/thread/list'
  ],
  routers: {
    get: function (req, res) {
      var Thread = req.models.Thread;
      var extracted = req.extracted || {};
      var query = extracted.query || req.query || {};
      var page = query.page > 0 ? query.page : 1;
      var limit = query.limit || config.list_topic_count || 10;
      threadShared.paginated(Thread, limit, page).then(function (threads) {
        res.errorize(res.errors.Success, threads);
      }).catch(res.onError);
    }
  },
  validations: {
    get: {
      query: {
        limit: {
          type: 'int'
        },
        page: {
          type: 'int'
        }
      }
    }
  },
  failures: {
    validation: function (err, req, res) {
      console.error(err, req.query);
      res.errorize(res.errors.InputInvalid, err);
    }
  }
};
