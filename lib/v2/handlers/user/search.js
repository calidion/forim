var github = require('../../util/github');

module.exports = {
  urls: [
    '/user/search'
  ],
  routers: {
    get: function (req, res) {
      var extracted = req.extracted;
      github.search({
        q: extracted.query.q
      }).then(function (users) {
        res.errorize(res.errors.Success, users);
      }).catch(function (error) {
        res.errorize(res.errors.Failure, error);
      });
    }
  },
  validations: {
    get: {
      query: {
        q: {
          type: 'string'
        }
      }
    }
  }
};
