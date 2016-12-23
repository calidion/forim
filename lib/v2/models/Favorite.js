/**
 * Copyright(c) 2016 calidion <calidion@gmail.com>
 * Apache 2.0 Licensed
 */
module.exports = {
  connection: 'default',
  identity: 'favorite',
  schema: true,
  tableName: 'favorite',
  attributes: {
    owner: {
      columnName: 'user_id',
      model: 'user',
      required: true
    },
    thread: {
      columnName: 'topic_id',
      model: 'thread',
      required: true
    },
    createdAt: {
      columnName: 'created_at',
      type: 'datetime',
      defaultsTo: Date.now
    }
  }
};
