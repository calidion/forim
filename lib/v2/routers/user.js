var paginator = require('waterline-paginator');
module.exports = function (User) {
  var router = require('express').Router;
  var user = router();
  user.all('/', function (req, res) {
    var limit = req.query.limit;
    var page = req.query.limit;
    paginator.paginate({
      model: User,
      limit: limit,
      page: page
    }, function (error, data) {
      if (error) {
        return res.errorize(res.errors.Failed, {
          error: error,
          data: data
        });
      }
      res.errorize(res.errors.Success, data);
    });
  });
  user.all('/:id', function single(req, res) {
    var id = req.params.id;
    if (!id) {
      return res.errorize(res.errors.Failed);
    }
    User.findOne({
      id: id
    }).then(function (user) {
      if (!user) {
        return res.errorize(res.errors.NotFound);
      }
      res.errorize(res.errors.Success, user);
    }).fail(function (error) {
      return res.errorize(res.errors.Failed, error);
    });
  });
  return user;
};
