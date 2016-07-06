/* eslint space-before-function-paren: 0 */

var getId = require('../util/getId');
var _ = require('lodash');
module.exports = function (model) {
  return {
    set: function (req, id, config, cb) {
      var userId = getId(req);
      model.findOrCreate(
        {
          user: String(userId),
          key: String(id)
        }, {
          user: String(userId),
          key: String(id),
          value: config
        }, function (error, data) {
          if (data && _.isEqual(data.value, config)) {
            return cb(error, data);
          }
          model.update(
            {
              user: String(userId),
              key: String(id)
            }, {
              user: String(userId),
              key: String(id),
              value: config
            }, function (error, data) {
              cb(error, data[0]);
            });
        });
    },
    get: function (req, id, cb) {
      var userId = getId(req);
      var data = {
        user: String(userId),
        key: String(id)
      };
      model.findOne(data, cb);
    }
  };
};
