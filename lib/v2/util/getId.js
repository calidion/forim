module.exports = function getId(req) {
  var id;
  if (req.session && req.session.user) {
    id = req.session.user._id || req.session.user.id;
  }
  return id;
};
