/**
 * Copyright(c) 2016 calidion <calidion@gmail.com>
 * Apache 2.0 Licensed
 */
module.exports = {
  connection: 'default',
  identity: 'file',
  schema: true,
  tableName: 'file',
  autoUpdatedAt: false,
  attributes: {
    user: {
      model: 'user',
      required: true
    },
    name: {
      type: 'string',
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
