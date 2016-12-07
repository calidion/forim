module.exports = {
  highestscored: function (User, limit) {
    return User.find({
      isBlocked: false,
      active: true
    }).sort({
      score: 'desc',
      createdAt: 'asc'
    }).limit(limit || 10);
  },
  highest100: function (User) {
    return this.highestscored(User, 100);
  }
};
