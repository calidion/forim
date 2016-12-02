
module.exports = {
  urls: [
    '/'
  ],
  routers: {
    get: function (req, res) {
      var extracted = req.extracted;
      res.render('index', extracted);
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
