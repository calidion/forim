/* eslint space-before-function-paren: 0 */

var getId = require('../util/getId');
var assert = require('assert');
module.exports = function (model) {
  return {
    set: function (req, id, config, cb) {
      var _id = req.params.id;
      assert(_id);
      model.findOnce(
        {
          id: _id
        },
        function (error, data) {
          console.log(error, data);
          assert(data.app.id === id);
          model.update(
            {
              id: String(_id)
            }, {
              value: config
            }, function (error, data) {
              console.log(error, data);
              console.log('updated');
              cb(error, data[0]);
            });
        });
    },
    get: function (req, id, cb) {
      var _id = req.params.id;
      assert(_id);
      model.findOne({ id: _id }, function (error, data) {
        // assert(data.app.id === id);
        cb(error, data);
      });
    }
  };
};
