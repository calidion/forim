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
      model: 'user',
      required: true
    },
    thread: {
      model: 'thread',
      required: true
    },
    createdAt: {
      type: 'datetime',
      defaultsTo: Date.now
    }
  }
};
