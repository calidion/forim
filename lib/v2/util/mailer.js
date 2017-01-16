var messager = require('egg-messager');
var config = require('../../config');
var path = require('path');

module.exports = {
  message: {
    'new': function(receiver, sender, cb) {
            // 模板目录
      var templatePath = path.resolve(__dirname, '../views/mail/message');
      // 激活地址
      var options = {
        // 发送类型
        type: 'email',
        // 接收人
        // toUser: config.name + ' <' + to + '>',
        toUser: receiver.email,
        // 邮件标题
        title: '你有新的聊天消息',
        // 邮件可配置参数
        options: {
          site: {
            name: config.name
          },
          receiver: receiver,
          sender: sender,
          im: 'xiv.im'
        },
        // 模板目录
        path: templatePath,
        // 模板名
        template: 'new.html'
      };
      messager(config.mail_opts, options, cb);
    }
  }, 
  friend: {
    add: function (to, sender, token, cb) {
      // 模板目录
      var templatePath = path.resolve(__dirname, '../views/mail/friend');
      // 激活地址
      var url = 'http://' + config.host + '/friend/ack?email=' + to + '&token=' + token;
      var options = {
        // 发送类型
        type: 'email',
        // 接收人
        // toUser: config.name + ' <' + to + '>',
        toUser: to,
        // 邮件标题
        title: '[' + config.name + ']好友添加通知',
        // 邮件可配置参数
        options: {
          site: {
            name: config.name
          },
          sender: sender,
          url: {
            accept: url + '&status=accept',
            reject: url + '&status=reject'
          },
          im: 'xiv.im'
        },
        // 模板目录
        path: templatePath,
        // 模板名
        template: 'add.html'
      };
      messager(config.mail_opts, options, cb);
    }
  },
  user: {
    activate: function (to, token, name, cb) {
      // 模板目录
      var templatePath = path.resolve(__dirname, '../views/mail/user');
      // 激活地址
      var url = 'http://' + config.host + '/user/activate?token=' + token + '&username=' + name;
      var options = {
        // 发送类型
        type: 'email',
        // 接收人
        // toUser: config.name + ' <' + to + '>',
        toUser: to,
        // 邮件标题
        title: '[' + config.name + ']帐号激活',
        // 邮件可配置参数
        options: {
          site: {
            name: config.name
          },
          user: {
            name: name
          },
          url: url
        },
        // 模板目录
        path: templatePath,
        // 模板名
        template: 'activate.html'
      };
      messager(config.mail_opts, options, cb);
    },
    password: {
      reset: function (to, token, name, cb) {
        // 模板目录
        var templatePath = path.resolve(__dirname, '../views/mail/user/password');
        // 激活地址
        var url = 'http://' + config.host + '/password/reset?key=' + token + '&username=' + name;
        var options = {
          // 发送类型
          type: 'email',
          // 接收人
          // toUser: config.name + ' <' + to + '>',
          toUser: to,
          // 邮件标题
          title: '[' + config.name + ']重置密码',
          // 邮件可配置参数
          options: {
            site: {
              name: config.name
            },
            user: {
              name: name
            },
            url: url
          },
          // 模板目录
          path: templatePath,
          // 模板名
          template: 'reset.html'
        };
        messager(config.mail_opts, options, cb);
      }
    }
  }
};
