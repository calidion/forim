module.exports = {
  highestscored: function (User, limit) {
    return User.find({
      blocked: false,
      active: true
    }).sort({
      score: 'desc',
      updatedAt: 'desc'
    }).limit(limit || 10);
  },
  highest100: function (User) {
    return this.highestscored(User, 100);
  }
};
