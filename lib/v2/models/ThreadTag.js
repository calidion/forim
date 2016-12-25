/**
 * Copyright(c) 2016 calidion <calidion@gmail.com>
 * Apache 2.0 Licensed
 */
module.exports = {
  connection: 'default',
  identity: 'threadtag',
  schema: true,
  tableName: 'threadtag',
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
      type: 'datetime',
      defaultsTo: Date.now
    }
  }
};
