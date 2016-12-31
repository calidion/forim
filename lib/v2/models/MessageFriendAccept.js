/**
 * Copyright(c) 2016 calidion <calidion@gmail.com>
 * Apache 2.0 Licensed
 */

/**
 * 好友请求与处理结果的
 */

module.exports = {
  connection: 'default',
  identity: 'messagefriend',
  schema: true,
  tableName: 'messagefriend',
  attributes: {
    user: {
      model: 'user',
      required: true
    },
    friend: {
      model: 'user',
      required: true
    },
    accepted: {
      type: 'boolean',
      defaultsTo: true
    },
    processed: {
      type: 'boolean',
      defaultsTo: false
    },
    createdAt: {
      columnName: 'create_at',
      type: 'datetime',
      defaultsTo: Date.now
    },
    updatedAt: {
      columnName: 'processed_at',
      type: 'datetime',
      defaultsTo: Date.now
    }
  }
};
