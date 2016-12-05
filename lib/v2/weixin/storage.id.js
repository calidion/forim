/* eslint space-before-function-paren: 0 */

var assert = require('assert');
module.exports = function (model) {
  return {
    set: function (req, id, config, cb) {
      var _id = req.params.id;
      assert(_id);
      model.findOnce(
        {
          user: _id
        },
        function (error, data) {
          assert(data.app.id === id);
          model.update({
            user: String(_id)
          }, {
            value: config
          }, function (error, data) {
            cb(error, data[0]);
          });
        });
    },
    get: function (req, id, cb) {
      var _id = req.params.id;
      assert(_id);
      model.findOne({
        user: _id
      }, function (error, data) {
        // assert(data.app.id === id);
        cb(error, data);
      });
    }
  };
};
