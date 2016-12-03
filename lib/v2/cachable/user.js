module.exports = {
  top: function(models) {
    var User = models.User;
    return User.find({
      isBlocked: false
    }).sort({
      score: 'desc'
    }).limit(10)
  }
}