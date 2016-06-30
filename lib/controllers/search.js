exports.index = function (req, res) {
  var config = require('../config');
  var q = req.query.q;
  q = encodeURIComponent(q);
  res.redirect('https://www.google.com.hk/#hl=zh-CN&q=site:' + config.site.base + '+' + q);
};
