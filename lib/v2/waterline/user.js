module.exports = {
  connection: 'default',
  identity: 'user',
  schema: true,
  tableName: 'users',
  autoCreatedAt: false,
  autoUpdatedAt: false,
  attributes: {
    name: {
      type: 'string'
    },
    loginname: {
      type: 'string'
    },
    pass: {
      type: 'string'
    },
    email: {
      type: 'string'
    },
    url: {
      type: 'string'
    },
    avatarUrl: {
      type: 'string',
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
      type: 'bool',
      defaultsTo: false
    },

    score: {
      type: 'int',
      defaultsTo: 0
    },
    topicCount: {
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
    favoriteTopics: {
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
      type: 'bool'
    },
    level: {
      type: 'string'
    },
    active: {
      type: 'bool',
      default: false
    },

    receive_reply_mail: {
      columnName: 'receive_reply_mail',
      type: 'bool',
      default: false
    },
    receive_at_mail: {
      columnName: 'receive_at_mail',

      type: 'bool',
      default: false
    },
    from_wp: {
      columnName: 'from_wp',
      type: 'bool'
    },

    retrieve_time: {
      columnName: 'retrieve_time',

      type: 'int'
    },
    retrieve_key: {
      columnName: 'retrieve_key',
      type: 'string'
    },

    accessToken: {
      type: 'string'
    }
  }
};
