var paginator = require('waterline-paginator');
var _ = require('lodash');

module.exports = {
  urls: [
    '/post/user/:username',
    '/v2/post/user/:username'
  ],
  routers: {
    get: function (req, res) {
      var User = req.models.User;
      var params = req.extracted.params;
      var query = req.extracted.query || {};
      User.findOne({
        username: params.username
      }).then(function (found) {
        if (!found) {
          return res.status(404).render(
            'notify/notify', {
              error: '这个用户不存在。'
            });
        }
        query.limit = query.limit || 10;
        query.page = query.page > 0 ? query.page : 1;
        paginator.paginate({
          conditions: {
            author: found.id
          },
          model: req.models.Post,
          populates: ['thread'],
          limit: query.limit,
          page: query.page
        }, function (err, result) {
          console.log(result);
          if (err) {
            console.error(err, result);
            return res.status(404).render(
              'notify/notify', {
                error: '数据库出错!'
              });
          }
          var threads = result.results.map(function (item) {
            return item.thread;
          });
          var objects = {
          };
          for(var i = 0; i < threads.length; i++) {
            objects[threads[i].id] = threads[i];
          }
          var threads = [];
          for(var id in objects) {
            threads.push(objects[id]);
          }
          console.log(threads);

          res.render('user/posts', {
            user: found,
            threads: threads,
            total: result.total,
            page: result.page,
            count: result.count
          });
        });
      }).fail(function (e) {
        console.error(e);
        return res.status(404).render(
          'notify/notify', {
            error: '数据库出错!'
          });
      });
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
      },
      params: {
        username: {
          type: 'string',
          required: true
        }
      }
    }
  }
};
