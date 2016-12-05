module.exports = {
  urls: ['/user/settings', '/v2/user/settings'],
  routers: {
    get: function (req, res) {
      var user = req.session.user;
      if (req.query.save === 'success') {
        user.success = '保存成功。';
      }
      return res.showPage('user/settings', user);
    },
    post: function (req, res) {
      var User = req.models.User;
      var user = req.session.user;
      var extracted = req.extracted.body;
      User.update({
        id: user.id
      }, extracted).then(function (updated) {
        req.session.user = updated[0];
        return res.redirect('/user/settings?save=success');
      }).fail(function (err) {
        console.error(err);
      });
    }
  },
  policies: {
    all: function (req, res, next) {
      if (!req.session || !req.session.user) {
        return res.status(403).send('Forbidden!');
      }
      next(true);
    }
  },
  validations: {
    required: ['post'],
    post: {
      body: {
        email: {
          type: 'email',
          required: true
        },
        username: {
          type: 'string',
          required: true
        },
        url: {
          type: 'url'
        },
        location: {
          type: 'string'
        },
        weibo: {
          type: 'string'
        },
        signature: {
          type: 'string'
        }
      }
    }
  }
};
