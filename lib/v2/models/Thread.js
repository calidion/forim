/**
 * Copyright(c) 2016 calidion <calidion@gmail.com>
 * Apache 2.0 Licensed
 */
module.exports = {
  connection: 'default',
  identity: 'thread',
  schema: true,
  tableName: 'thread',
  attributes: {
    title: {
      type: 'string',
      required: true
    },
    content: {
      type: 'text',
      required: true
    },
    author: {
      model: 'user',
      required: true
    },
    posts: {
      collection: 'post',
      via: 'thread'
    },
    // 置顶帖
    sticky: {
      type: 'boolean',
      defaultsTo: false
    },
    // 精华贴
    highlighted: {
      type: 'boolean',
      defaultsTo: false
    },
    // 锁定贴
    locked: {
      type: 'boolean',
      defaultsTo: false
    },
    replies: {
      type: 'int',
      defaultsTo: 0
    },
    visits: {
      type: 'int',
      defaultsTo: 0
    },
    favorites: {
      type: 'int',
      defaultsTo: 0
    },
    createdAt: {
      columnName: 'created_at',
      type: 'datetime',
      defaultsTo: Date.now
    },
    updatedAt: {
      columnName: 'updated_at',
      type: 'datetime',
      defaultsTo: Date.now
    },
    lastReplier: {
      columnName: 'last_reply',
      model: 'user'
    },
    lastPost: {
      columnName: 'last_post',
      model: 'post'
    },
    lastReplyAt: {
      columnName: 'last_reply_at',
      type: 'datetime',
      defaultsTo: function () {
        return new Date();
      }
    },
    category: {
      type: 'string'
    },
    deleted: {
      type: 'boolean',
      defaultsTo: false
    }
  }
};
