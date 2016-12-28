module.exports = {
  isFriend: function (Friend, user, friend) {
    return Friend.findOne({
      or: [{
        user: user.id,
        friend: friend.id
      }, {
        friend: user.id,
        user: friend.id
      }]
    }).then(function(friend) {
      return friend;
    });
  }
};
