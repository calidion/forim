module.exports = function getId(req, nullable) {
  var id = req.session && req.session.user && req.session.user._id;
  if (!id && !nullable) {
    id = -1;
  }
  return id;
};
