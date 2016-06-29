/**
 * Forim - User Router
 * Copyright(c) 2016 calidion <calidion@gmail.com>
 * Apache 2.0 Licensed
 */
module.exports = {
  connection: 'default',
  identity: 'settings',
  schema: true,
  tableName: 'settings',
  autoCreatedAt: false,
  autoUpdatedAt: false,
  attributes: {
    user: {
      model: 'user'
    },
    key: {
      type: 'string'
    },
    value: {
      type: 'json'
    }
  }
};
