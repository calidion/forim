module.exports = {
  connection: 'default',
  identity: 'user',
  schema: true,
  tableName: 'user',
  attributes: {
    nickname: {
      columnName: 'name',
      type: 'string'
    },
    username: {
      columnName: 'loginname',
      type: 'string',
      required: true,
      unique: true
    },
    password: {
      columnName: 'pass',
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
    avatarUrl: {
      type: 'url',
      columnName: 'profile_image_url'
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
    isBlocked: {
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
      type: 'int',
      defaultsTo: 0
    },
    favoriteThreads: {
      type: 'int',
      defaultsTo: 0
    },
    createdAt: {
      type: 'date',
      default: Date.now
    },
    updatedAt: {
      type: 'date',
      default: Date.now
    },
    isStar: {
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
      type: 'bool',
      default: false
    },
    // 密码取回的时间
    passwordRetrieveTime: {
      type: 'int'
    },
    passwordRetrieveKey: {
      type: 'string'
    },
    accessToken: {
      type: 'string'
    },
    salt: {
      type: 'string'
    }
  }
};
