/* eslint space-before-function-paren: 0 */

var _ = require('lodash');
module.exports = function (model) {
  return {
    set: function (id, config, cb) {
      id = id || '-1';
      model.findOrCreate(
        {
          user: id
        }, {
          user: id,
          value: config
        }, function (error, data) {
          if (_.isEqual(data.value, config)) {
            return cb(error, data);
          }
          model.update(
            {
              user: id
            }, {
              user: id,
              value: config
            }, function (error, data) {
              cb(error, data[0]);
            });
        });
    },
    get: function (id, cb) {
      model.findOne({
        user: id
      }, cb);
    }
  };
};
