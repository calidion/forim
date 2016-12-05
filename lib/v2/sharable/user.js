module.exports = {
  highestscored: function (User, limit) {
    return User.find({
      isBlocked: false,
      active: true
    }).sort({
      score: 'desc'
    }).limit(limit || 10);
  }
};
