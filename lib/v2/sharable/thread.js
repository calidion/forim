var paginator = require('waterline-paginator');
module.exports = {
  unanswered: function (Thread) {
    return Thread.find({
      deleted: false,
      locked: false,
      lastReplier: null
    }).sort({
      createdAt: 'desc'
    }).limit(5);
  },
  paginated: function (Thread, limit, page) {
    return new Promise(function (resolve, reject) {
      paginator.paginate({
        model: Thread,
        conditions: {
          deleted: false,
          locked: false
        },
        limit: limit,
        page: page,
        sorts: ['sticky desc', 'lastReplyAt desc'],
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
          deleted: false,
          locked: false,
          highlighted: true
        },
        limit: limit,
        page: page,
        sorts: ['sticky desc', 'lastReplyAt desc'],
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
  userCreated: function (user, Thread) {
    return Thread.find({
      author: user.id
    }).sort('createdAt desc').limit(5);
  },
  userAttended: function (user, Thread, Post) {
    return Post.find({
      author: user.id
    }).limit(10 * 2).then(function (posts) {
      var threads = [];
      posts.forEach(function (item) {
        threads.push(item.thread);
      });
      return Thread.find({
        id: threads
      }).limit(5);
    });
  }
};
