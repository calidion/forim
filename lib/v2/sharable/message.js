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
      result = messages
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
    }).then(function() {
      return result;
    }).catch(function(err) {
      console.error(err);
    });
  }
};
