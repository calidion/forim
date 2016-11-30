var config = require('../../config');

module.exports = [{
  urls: ['/search'],
  routers: {
    all: function (req, res) {
      var q = '';
      if (req.query && req.query.q) {
        q = req.query.q;
      }
      var url = 'https://www.google.com.hk/#hl=zh-CN&q=site:' +
        config.site.base + '+' +
        encodeURIComponent(q);
      res.redirect(url);
    }
  }
}];
