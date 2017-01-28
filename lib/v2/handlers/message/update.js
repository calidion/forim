var isLogin = require('../../policies/isLogin');
var inputInvalidHandler = require('../../errors/handlers/InputInvalid');

module.exports = {
  urls: ['/message/update'],
  routers: {
    post: function (req, res) {
      var user = req.session.user;
      var extracted = req.extracted.body;
      var InstantMessage = req.models.InstantMessage;

      InstantMessage.findOne({
        id: extracted.id,
        sender: user.id
      }).populate('receiver').populate('sender').then(function (found) {
        if (!found) {
          return res.errorize(res.errors.MessageNotFound);
        }
        InstantMessage.update(
          {
            id: extracted.id
          },
          {
            text: extracted.text
          }
        ).then(function (updated) {
          var im = updated[0];
          im.sender = found.sender;
          im.receiver = found.receiver;
          res.errorize(res.errors.Success, im);
        }).fail(res.onError);
      }).fail(res.onError);
    }
  },
  policies: {
    post: isLogin
  },
  validations: {
    post: {
      body: {
        id: {
          type: 'string',
          required: true
        },
        text: {
          type: 'text',
          required: true
        }
      }
    }
  },
  failures: {
    validation: inputInvalidHandler
  }
};
