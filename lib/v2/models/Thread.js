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
      columnName: 'lock',
      type: 'boolean',
      defaultsTo: false
    },
    replies: {
      columnName: 'reply_count',
      type: 'int',
      defaultsTo: 0
    },
    visits: {
      columnName: 'visit_count',
      type: 'int',
      defaultsTo: 0
    },
    favorites: {
      columnName: 'collect_count',
      type: 'int',
      defaultsTo: 0
    },
    createdAt: {
      type: 'datetime',
      defaultsTo: Date.now
    },
    updatedAt: {
      type: 'datetime',
      defaultsTo: Date.now
    },
    lastReplier: {
      model: 'user'
    },
    lastPost: {
      model: 'post'
    },
    lastReplyAt: {
      type: 'datetime',
      defaultsTo: function () {
        return new Date();
      }
    },
    isHtmlContent: {
      type: 'boolean',
      defaultsTo: false
    },
    category: {
      columnName: 'tab',
      type: 'string'
    },
    isDeleted: {
      type: 'boolean',
      defaultsTo: false
    }
  }
};
