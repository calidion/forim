var isLogin = require('../../policies/isLogin');
var inputInvalidHandler = require('../../errors/handlers/InputInvalid');

module.exports = {
  urls: ['/message/breath'],
  routers: {
    get: function (req, res) {
      var user = req.session.user;
      var InstantMessage = req.models.InstantMessage;
      var extracted = req.extracted ? req.extracted.query : '';
      var options = {
        receiver: user.id,
        read: false
      };
      if (extracted && extracted.id) {
        options.sender = extracted.id;
      }
      console.log('inside breath');
      console.log(options);
      InstantMessage.count(options).then(function (count) {
        console.log(count);
        res.errorize(res.errors.Success, count);
      }).fail(res.onError);
    }
  },
  policies: {
    get: isLogin
  },
  validations: {
    get: {
      query: {
        id: {
          type: 'string'
        }
      }
    }
  },
  failures: {
    validation: inputInvalidHandler
  }
};
