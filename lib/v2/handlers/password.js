var retrieve = require('./password/retrieve');
var reset = require('./password/reset');
var update = require('./password/update');
module.exports = [
  retrieve,
  reset,
  update
];
