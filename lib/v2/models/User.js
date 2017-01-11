var _ = require('lodash');

module.exports = {
  connection: 'default',
  identity: 'user',
  schema: true,
  tableName: 'user',
  attributes: {
    nickname: {
      type: 'string'
    },
    username: {
      type: 'string',
      required: true,
      unique: true
    },
    password: {
      type: 'string',
      required: true
    },
    email: {
      type: 'email',
      required: true
    },
    url: {
      type: 'url'
    },
    location: {
      type: 'string'
    },
    signature: {
      type: 'string'
    },
    profile: {
      type: 'string'
    },
    weibo: {
      type: 'string'
    },
    avatar: {
      type: 'string'
    },
    githubId: {
      type: 'string'
    },
    githubUsername: {
      type: 'string'
    },
    githubAccessToken: {
      type: 'string'
    },
    blocked: {
      type: 'boolean',
      defaultsTo: false
    },
    score: {
      type: 'int',
      defaultsTo: 0
    },
    threads: {
      type: 'int',
      defaultsTo: 0
    },
    replies: {
      type: 'int',
      defaultsTo: 0
    },
    followers: {
      type: 'int',
      defaultsTo: 0
    },
    followees: {
      type: 'int',
      defaultsTo: 0
    },
    favoriteTags: {
      columnName: 'collect_tag_count',
      type: 'int',
      defaultsTo: 0
    },
    favoriteThreads: {
      columnName: 'collect_topic_count',
      type: 'int',
      defaultsTo: 0
    },
    createdAt: {
      columnName: 'create_at',

      type: 'date',
      default: Date.now
    },
    updatedAt: {
      columnName: 'update_at',
      type: 'date',
      default: Date.now
    },
    starred: {
      type: 'boolean'
    },
    level: {
      type: 'string'
    },
    active: {
      type: 'boolean',
      default: false
    },
    mailingReplies: {
      columnName: 'receive_reply_mail',
      type: 'bool',
      default: false
    },
    // 密码取回的时间
    passwordRetrieveTime: {
      columnName: 'retrieve_time',
      type: 'int'
    },
    passwordRetrieveKey: {
      columnName: 'retrieve_key',
      type: 'string'
    },
    accessToken: {
      type: 'string'
    },
    salt: {
      type: 'string'
    },
    toJSON: function () {
      var obj = this.toObject();
      obj = _.omit(obj, [
        'password', 'salt', 'active', 'blocked',
        'passwordRetrieveKey']);
      return obj;
    }
  }
};
