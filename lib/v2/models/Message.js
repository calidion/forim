/**
 * Copyright(c) 2016 calidion <calidion@gmail.com>
 * Apache 2.0 Licensed
 */
module.exports = {
  connection: 'default',
  identity: 'message',
  schema: true,
  tableName: 'message',
  attributes: {
    type: 'string',
    receiver: {
      columnName: 'master_id',
      model: 'user',
      required: true
    },
    sender: {
      columnName: 'author_id',
      model: 'user',
      required: true
    },
    thread: {
      columnName: 'topic_id',
      model: 'thread',
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
      columnName: 'updated_at',
      type: 'datetime',
      defaultsTo: Date.now
    },
    isRead: {
      columnName: 'has_read',
      type: 'boolean',
      defaultsTo: false
    }
  }
};
