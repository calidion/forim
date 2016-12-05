/* eslint space-before-function-paren: 0 */

var getId = require('../util/getId');
var _ = require('lodash');
module.exports = function (model) {
  return {
    set: function (req, id, config, cb) {
      var userId = getId(req);
      var options = {
        user: String(userId)
      };
      var updates = {
        user: String(userId),
        value: config
      };
      if (config.app && config.app.id) {
        updates.key = config.app.id;
      }
      model.findOrCreate(options
        , updates, function (error, data) {
          if (data && _.isEqual(data.value, config)) {
            return cb(error, data);
          }
          model.update(options, updates, function (error, data) {
            cb(error, data[0]);
          });
        });
    },
    get: function (req, id, cb) {
      var userId = getId(req);
      var data = {
        user: String(userId)
      };
      model.findOne(data, cb);
    }
  };
};
