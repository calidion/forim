var friendModule = {
  find: function (Friend, user, friend) {
    return Friend.findOne({
      or: [{
        user: user.id,
        friend: friend.id
      }, {
        friend: user.id,
        user: friend.id
      }]
    });
  },
  isFriend: function (Friend, user, friend) {
    return friendModule.find(Friend, user, friend).then(function (found) {
      return found;
    });
  },
  create: function (Friend, user, friend) {
    return friendModule.find(Friend, user, friend).then(function (found) {
      if (found) {
        return found;
      }
      return Friend.create({
        user: user.id,
        friend: friend.id
      }).then(function (created) {
        return created;
      });
    });
  },
  remove: function (Friend, user, friend) {
    return Friend.destroy({
      user: user.id,
      friend: friend.id
    });
  }
};

module.exports = friendModule;
