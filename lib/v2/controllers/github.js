module.exports = {
  onCallback: function (req, res, next) {
    var User = req.models.User;
    var profile = req.user;
    User.findOne({
      githubId: profile.id
    }).then(function (found) {
      if (!found) {
        req.session.profile = profile;
        return res.redirect('/auth/github/new');
      }
      found.githubUsername = profile.username;
      found.githubId = profile.id;
      found.githubAccessToken = profile.accessToken;
      found.avatar = profile._json.avatar_url;
      found.save(function (err) {
        if (err) {
          return res.status(500)
            .send('服务器未知错误');
        }
        req.session.user = found;
        return res.redirect('/');
      });
    }).fail(function(err) {
      next(err);
    });
  }
};
