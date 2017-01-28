var isLogin = require('../../policies/isLogin');
var config = require('../../../config');

module.exports = {
  urls: ['/message/list'],
  routers: {
    get: function (req, res) {
      var user = req.session.user;
      var InstantMessage = req.models.InstantMessage;
      var extracted = req.extracted || {};
      var limit = extracted.query && extracted.query.limit ? extracted.query.limit : config.limits.normal;
      var page = extracted.query ? extracted.query.page : 1;
      var unread = extracted.query ? extracted.query.unread : 'false';
      if (page <= 1) {
        page = 1;
      }
      var options = {
        or: [
          {
            sender: user.id,
            receiver: extracted.query.id
          },
          {
            receiver: user.id,
            sender: extracted.query.id
          }
        ]
      };
      if (unread === 'true') {
        for (let i = 0; i < options.or.length; i++) {
          options.or[i].read = false;
        }
      }
      InstantMessage.find(options).populate('receiver')
        .populate('sender').sort({
          createdAt: 'desc'
        }).limit(limit).skip(limit * (page - 1)).then(function (messages) {
          res.errorize(res.errors.Success, messages);
        }).fail(res.onError);
    }
  },
  policies: {
    get: isLogin
  },
  validations: {
    get: {
      required: ['query'],
      query: {
        id: {
          type: 'string',
          required: true
        },
        unread: {
          type: 'bool'
        },
        limit: {
          type: 'int'
        },
        page: {
          type: 'int'
        }
      }
    }
  },
  failures: {
    validation: function (err, req, res) {
      console.error(err);
      console.error('validation error, please verify your input:');
      console.error(req.query);
      res.errorize(res.errors.InputInvalid);
    }
  }
};
