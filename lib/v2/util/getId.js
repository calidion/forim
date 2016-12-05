var assert = require('assert');
module.exports = function getId(req) {
  var id;
  assert(req);
  if (req && req.session && req.session.user) {
    id = req.session.user._id || req.session.user.id;
  }
  return id;
};
