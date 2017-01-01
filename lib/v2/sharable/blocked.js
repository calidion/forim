var blockedModule = {
  find: function (UserBlocked, user, blocked) {
    return UserBlocked.findOne({
      or: [{
        user: user.id,
        blocked: blocked.id
      }, {
        blocked: user.id,
        user: blocked.id
      }]
    });
  },
  isUserBlocked: function (UserBlocked, user, blocked) {
    return blockedModule.find(UserBlocked, user, blocked).then(function (found) {
      return found;
    });
  },
  create: function (UserBlocked, user, blocked) {
    return blockedModule.find(UserBlocked, user, blocked).then(function (found) {
      if (found) {
        return found;
      }
      return UserBlocked.create({
        user: user.id,
        blocked: blocked.id
      }).then(function (created) {
        return created;
      });
    });
  },
  remove: function (UserBlocked, user, blocked) {
    return UserBlocked.destroy({
      user: user.id,
      blocked: blocked.id
    });
  }
};

module.exports = blockedModule;
