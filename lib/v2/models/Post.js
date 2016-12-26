/**
 * Copyright(c) 2016 calidion <calidion@gmail.com>
 * Apache 2.0 Licensed
 */
module.exports = {
  connection: 'default',
  identity: 'post',
  schema: true,
  tableName: 'post',
  attributes: {
    content: 'text',
    thread: {
      model: 'thread',
      required: true
    },
    author: {
      model: 'user',
      required: true
    },
    parent: {
      model: 'post'
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
    like: {
      connection: 'postlike',
      via: 'post'
    },
    likes: {
      type: 'int',
      defaultsTo: 0
    },
    deleted: {
      type: 'boolean',
      defaultsTo: false
    }
  }
};
