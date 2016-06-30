var filters = {
  settings: require('./settings')
};

module.exports = function (req, res, next) {
  req.__filters = filters;
  next();
};
