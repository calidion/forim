module.exports = {
  urls: [
    '/auth/github/create',
    '/v2/oauth/github/create'
  ],
  routers: {
    get: function (req, res) {
      res.showPage('sign/new_oauth', {
        actionPath: '/auth/github/create'
      });
    }
  }
};

