/**
 * Copyright(c) 2016 calidion <calidion@gmail.com>
 * Apache 2.0 Licensed
 */
module.exports = {
  connection: 'default',
  identity: 'instantmessage',
  schema: true,
  tableName: 'instantmessage',
  attributes: {
    text: 'text',
    receiver: {
      model: 'user',
      required: true
    },
    sender: {
      model: 'user',
      required: true
    },
    createdAt: {
      columnName: 'create_at',
      type: 'datetime',
      defaultsTo: Date.now
    },
    updatedAt: {
      columnName: 'updated_at',
      type: 'datetime',
      defaultsTo: Date.now
    },
    read: {
      type: 'boolean',
      defaultsTo: false
    }
  }
};
