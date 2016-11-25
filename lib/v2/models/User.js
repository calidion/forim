module.exports = {
  connection: 'default',
  identity: 'user',
  schema: true,
  tableName: 'users',
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
      columnName: 'is_block',
      type: 'boolean',
      defaultsTo: false
    },
    score: {
      type: 'int',
      defaultsTo: 0
    },
    threads: {
      columnName: 'topic_count',
      type: 'int',
      defaultsTo: 0
    },
    replies: {
      columnName: 'reply_count',
      type: 'int',
      defaultsTo: 0
    },
    followers: {
      columnName: 'follower_count',
      type: 'int',
      defaultsTo: 0
    },
    followees: {
      columnName: 'following_count',
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
    isStar: {
      columnName: 'is_star',
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
    retrieveTimes: {
      columnName: 'retrieve_time',
      type: 'int'
    },
    retrieveKey: {
      columnName: 'retrieve_key',
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
