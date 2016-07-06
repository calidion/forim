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
          console.log(error, data);
          if (data && _.isEqual(data.value, config)) {
            console.log('found');
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
              console.log(error, data);
              console.log('updated');
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
      console.log(data);
      model.findOne(data, cb);
    }
  };
};
