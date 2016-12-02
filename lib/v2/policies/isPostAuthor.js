module.exports = function (req, res, next) {
  if (!req.session || !req.session.user) {
    return next(false);
  }
  var ids = /^\/post\/edit\/(\w+)$/.exec(req.url);
  var id = ids[1];
  var Post = req.models.Post;
  var user = req.session.user;

  Post.findOne({
    id: id,
    author: user.id
  }).then(function (post) {
    if (!post) {
      return next(false);
    }
    req._post = post;
    next(true);
  }).fail(function (err) {
    console.error(err);
    next(false);
  });
};
