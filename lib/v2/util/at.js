var at = {
  purify: function (toBePurified) {
    if (!toBePurified) {
      return [];
    }
    var purifiers = [
      // 去除单行的 ```
      /```.+?```/g,
      // ``` 里面的是 pre 标签内容
      /^```[\s\S]+?^```/gm,
      // 同一行中，`some code` 中内容也不该被解析
      /`[\s\S]+?`/g,
      // 4个空格也是 pre 标签，在这里 . 不会匹配换行
      /^ {4}.*/gm,
      // somebody@gmail.com 会被去除
      /\b\S*?@[^\s]*?\..+?\b/g,
      // 已经被 link 的 username
      /\[@.+?\]\(\/.+?\)/g
    ];
    purifiers.forEach(function (purifier) {
      toBePurified = toBePurified.replace(purifier, '');
    });
    return toBePurified;
  },
  extract: function (content) {
    content = at.purify(content);
    var users = content.match(/@[a-z0-9\-_]+\b/igm);
    if (!users || !users.length) {
      return [];
    }
    users = users.filter(function (value, index, self) {
      return self.indexOf(value) === index;
    });
    return users.map(function (user) {
      return user.slice(1);
    });
  },
  parse: function (req, content, options, next) {
    var users = at.extract(content);
    users = users.filter(function (item) {
      return item === options.sender.username;
    });
    var User = req.models.User;
    var Message = req.models.Message;
    User.find({
      username: users
    }).then(function (founds) {
      var records = [];
      founds.forEach(function () {
        records.push({
          type: options.type || 'at',
          sender: options.sender.id,
          author: options.author.id,
          replier: options.replier.id
        });
      });
      return Message.create(records);
    }).then(function (messages) {
      if (next) {
        next(messages);
      }
    }).fail(function (err) {
      console.error(err);
    });
  }
};
module.exports = at;
