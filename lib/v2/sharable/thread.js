var paginator = require('waterline-paginator');
module.exports = {
  unanswered: function (Thread) {
    return Thread.find({
      isDeleted: false,
      locked: false,
      lastReplier: null
    }).sort({
      createdAt: 'desc'
    }).limit(10);
  },
  paginated: function (Thread, limit, page) {
    return new Promise(function (resolve, reject) {
      paginator.paginate({
        model: Thread,
        conditions: {
          isDeleted: false,
          locked: false
        },
        limit: limit,
        page: page,
        sorts: ['top desc', 'lastReplyAt desc'],
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
    });
  },
  highlighted: function (Thread, limit, page) {
    return new Promise(function (resolve, reject) {
      paginator.paginate({
        model: Thread,
        conditions: {
          isDeleted: false,
          locked: false,
          highlighted: true
        },
        limit: limit,
        page: page,
        sorts: ['top desc', 'lastReplyAt desc'],
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
    });
  }
};
