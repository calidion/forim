/**
 * Copyright(c) 2016 calidion <calidion@gmail.com>
 * Apache 2.0 Licensed
 */
module.exports = {
  connection: 'default',
  identity: 'thread_tag',
  schema: true,
  tableName: 'thread_tag',
  autoUpdatedAt: false,
  attributes: {
    tags: {
      model: 'tag'
    },
    thread: {
      model: 'thread',
      required: true
    },
    order: {
      type: 'int',
      required: true,
      defaultsTo: 0
    },
    official: {
      type: 'boolean',
      required: true,
      defaultsTo: false
    },
    createdAt: {
      columnName: 'created_at',
      type: 'datetime',
      defaultsTo: Date.now
    }
  }
};
