var isLogin = require('../../policies/isLogin');
var inputInvalidHandler = require('../../errors/handlers/InputInvalid');

module.exports = {
  urls: ['/message/breath'],
  routers: {
    get: function (req, res) {
      var user = req.session.user;
      var InstantMessage = req.models.InstantMessage;
      var extracted = req.extracted.query;
      var options = {
        sender: user.id,
        receiver: extracted.id,
        read: false
      };
      InstantMessage.count(options).then(function (count) {
        res.errorize(res.errors.Success, count);
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
        }
      }
    }
  },
  failures: {
    validation: inputInvalidHandler
  }
};
