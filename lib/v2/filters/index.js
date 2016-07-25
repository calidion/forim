var validator = require('node-form-validator');
var filters = {
  settings: require('./settings'),
  user: {
    register: require('./user/register')
  }
};

module.exports = function (req, res, next) {
  req.__filters = filters;
  req.filter = function (data, filter) {
    return validator.validate(data, filter);
  };
  next();
};
