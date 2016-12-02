/**
 * Copyright(c) 2016 calidion <calidion@gmail.com>
 * Apache 2.0 Licensed
 */
module.exports = {
  connection: 'default',
  identity: 'postlike',
  schema: true,
  tableName: 'postlike',
  autoUpdatedAt: false,
  attributes: {
    user: {
      model: 'user',
      required: true
    },
    post: {
      model: 'post',
      required: true
    },
    createdAt: {
      columnName: 'created_at',
      type: 'datetime',
      defaultsTo: Date.now
    }
  }
};
