/**
 * Copyright(c) 2016 calidion <calidion@gmail.com>
 * Apache 2.0 Licensed
 */
module.exports = {
  connection: 'default',
  identity: 'admin',
  schema: true,
  tableName: 'admin',
  autoCreatedAt: false,
  autoUpdatedAt: false,
  attributes: {
    user: {
      model: 'user',
      required: true,
      unique: true
    },
    privileges: {
      type: 'string'
    }
  }
};
