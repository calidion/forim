/**
 * Copyright(c) 2016 calidion <calidion@gmail.com>
 * Apache 2.0 Licensed
 */
module.exports = {
  connection: 'default',
  identity: 'post',
  schema: true,
  tableName: 'replies',
  attributes: {
    content: 'text',
    thread: {
      columnName: 'topic_id',
      model: 'thread',
      required: true
    },
    author: {
      columnName: 'author_id',
      model: 'user',
      required: true
    },
    replier: {
      columnName: 'reply_id',
      model: 'user',
      required: true
    },
    createdAt: {
      columnName: 'create_at',
      type: 'datetime',
      defaultsTo: Date.now
    },
    updatedAt: {
      columnName: 'update_at',
      type: 'datetime',
      defaultsTo: Date.now
    },
    isHtml: {
      columnName: 'content_is_html',
      type: 'boolean',
      defaultsTo: false
    },
    likes: {
      columnName: 'ups',
      type: 'json'
    },
    isDeleted: {
      columnName: 'deleted',
      type: 'boolean',
      defaultsTo: false
    }
  }
};
