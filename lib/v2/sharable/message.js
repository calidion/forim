module.exports = {
  myMessage: function (Message, user) {
    var read = Message.find({
      receiver: user.id,
      read: true
    }).populate('sender').populate('thread').populate('replier');
    var unread = Message.find({
      receiver: user.id,
      read: true
    }).populate('sender').populate('thread').populate('replier');
    var result;
    return Promise.all([read, unread]).then(function (messages) {
      result = messages;
      var unread = [messages[1]].map(function (item) {
        return {
          id: item.id
        };
      });
      return unread;
    }).then(function (ids) {
      return Message.update(ids, {
        read: true
      });
    }).then(function () {
      return result;
    }).catch(function (err) {
      console.error(err);
    });
  },
  friend: {
    invite: {
      create: function (MessageFriendInvite, user, email, token) {
        return MessageFriendInvite.create({
          user: user.id,
          email: email,
          token: token
        });
      },
      process: function (MessageFriendInvite, options) {
        return MessageFriendInvite.findOne({
          email: options.email,
          token: options.token,
          processed: false
        }).populate('user').then(function (found) {
          if (!found) {
            return false;
          }
          return MessageFriendInvite.update(
            {
              email: options.email
            },
            {
              processed: true
            }
          ).then(function () {
            return found;
          });
        });
      }
    },
    accept: {
      /**
       * @param {MessageFriendAccept} MessageFriendAccept
       * @param {User} user
       * @param {User} friend
       * @returns {MessageFriendAccept}
       */
      create: function (MessageFriendAccept, user, friend) {
        return MessageFriendAccept.findOne({
          user: user,
          friend: friend,
          processed: false
        }).then(function (found) {
          if (found) {
            return false;
          }
          return MessageFriendAccept.create({
            user: user,
            friend: friend
          });
        }).fail(function (err) {
          console.error(err);
        });
      },
      process: function (MessageFriendAccept, user, friend, status) {
        return MessageFriendAccept.findOne({
          user: user.id,
          friend: friend.id,
          processed: false
        }).then(function (found) {
          if (!found) {
            return false;
          }
          MessageFriendAccept.update(
            {
              id: found.id
            }, {
              processed: true,
              status: status
            });
        });
      },
      /**
       * get user message from acceptance when his friend invitation issued.
       */
      get: function (MessageFriendAccept, user) {
        return MessageFriendAccept.findOne({
          friend: user.id,
          processed: false
        });
      }
    }
  }
};
