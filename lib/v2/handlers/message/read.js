var isLogin = require('../../policies/isLogin');
// var message = require('../../sharable/im');
module.exports = {
  urls: ['/message/read'],
  routers: {
    post: function (req, res) {
      var user = req.session.user;
      var extracted = req.extracted.body;
      var InstantMessage = req.models.InstantMessage;
      var ids = extracted.id.split(',')

      var conditions = {
        id: ids,
        receiver: user.id
      };

      InstantMessage.update(conditions,
        {
          read: true
        }
      ).then(function (updated) {
        if (!updated.length) {
          return res.errorize(res.errors.MessageNotFound);
        }
        InstantMessage
          .find(conditions)
          .populate('receiver')
          .populate('sender')
          .then(function (found) {
            res.errorize(res.errors.Success, found);
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
        }
      }
    }
  },
  failures: {
    validation: function (err, req, res) {
      console.error(err);
      console.error('validation error, please verify your input:');
      console.error(req.body);
      res.errorize(res.errors.InputInvalid);
    }
  }
};
