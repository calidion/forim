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
      model: 'user',
      required: true
    },
    sender: {
      model: 'user',
      required: true
    },
    thread: {
      model: 'thread',
      required: true
    },
    replier: {
      model: 'user',
      required: true
    },
    createdAt: {
      type: 'datetime',
      defaultsTo: Date.now
    },
    updatedAt: {
      type: 'datetime',
      defaultsTo: Date.now
    },
    isRead: {
      type: 'boolean',
      defaultsTo: false
    }
  }
};
