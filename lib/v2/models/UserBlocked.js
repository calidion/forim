/**
 * Copyright(c) 2016 calidion <calidion@gmail.com>
 * Apache 2.0 Licensed
 */
module.exports = {
  connection: 'default',
  identity: 'userblocked',
  schema: true,
  tableName: 'userblocked',
  autoUpdatedAt: false,
  attributes: {
    user: {
      model: 'user',
      required: true
    },
    blocked: {
      model: 'user',
      required: true
    },
    createdAt: {
      type: 'datetime',
      defaultsTo: Date.now
    }
  }
};
