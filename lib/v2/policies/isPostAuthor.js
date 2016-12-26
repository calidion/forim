module.exports = function (req, res, next) {
  if (!req.session || !req.session.user || req.session.user.blocked) {
    res.status(403)
      .showPage('notify/notify', {
        error: '对不起，你不能编辑此回复。'
      });
    return next(false);
  }
  var id;
  var ids = /^\/post\/edit\/(\w+)$/.exec(req.url);
  if (ids) {
    id = ids[1];
  } else {
    id = req.body.id;
  }
  var Post = req.models.Post;
  var user = req.session.user;

  Post.findOne({
    id: id,
    author: user.id
  })
    .populate('author')
    .populate('thread')
    .then(function (post) {
      if (!post) {
        res.status(404)
          .showPage('notify/notify', {
            error: '回复不存在或已被删除。'
          });
        return next(false);
      }
      req._post = post;
      next(true);
    }).fail(function (err) {
      console.error(err);
      next(false);
    });
};
