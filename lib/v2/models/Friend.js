/**
 * Copyright(c) 2016 calidion <calidion@gmail.com>
 * Apache 2.0 Licensed
 */
module.exports = {
  connection: 'default',
  identity: 'friend',
  schema: true,
  tableName: 'friend',
  autoUpdatedAt: false,
  attributes: {
    user: {
      model: 'user',
      required: true
    },
    friend: {
      model: 'user',
      required: true
    },
    createdAt: {
      type: 'datetime',
      defaultsTo: Date.now
    }
  }
};
