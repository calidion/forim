module.exports = {
  urls: ['/user/logout', '/v2/user/logout'],
  routers: {
    all: function (req, res) {
      req.session.user = null;
      res.redirect('/');
    }
  }
};
