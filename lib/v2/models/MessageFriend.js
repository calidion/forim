/**
 * Copyright(c) 2016 calidion <calidion@gmail.com>
 * Apache 2.0 Licensed
 */
module.exports = {
  connection: 'default',
  identity: 'messagefriend',
  schema: true,
  tableName: 'messagefriend',
  autoUpdatedAt: false,
  attributes: {
    user: {
      model: 'user',
      required: true
    },
    email: {
      type: 'email',
      required: true
    },
    read: {
      type: 'boolean',
      defaultsTo: false
    },
    createdAt: {
      columnName: 'create_at',
      type: 'datetime',
      defaultsTo: Date.now
    }
  }
};
