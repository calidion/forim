// static page
// About
exports.about = function(req, res, next) {
  res.render('static/about', {
    pageTitle: '关于我们'
  });
};

// FAQ
exports.faq = function(req, res, next) {
  res.render('static/faq');
};

exports.getstart = function(req, res) {
  res.render('static/getstart', {
    pageTitle: 'Node.js 新手入门'
  });
};

exports.api = function(req, res, next) {
  res.render('static/api');
};
