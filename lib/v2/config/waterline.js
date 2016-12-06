var mysqlConf = {
  adapter: 'mysql',
  host: process.env.FORIM_MYSQL_DB_HOST || '127.0.0.1',
  user: process.env.FORIM_MYSQL_DB_USER || 'forim',
  password: process.env.FORIM_MYSQL_DB_PASSWORD || 'forim',
  database: process.env.FORIM_MYSQL_DB_NAME || 'forim',
  prefix: process.env.FORIM_MYSQL_DB_PREFIX || ''
};
var mongoConf = {
  adapter: 'mongo',
  url: process.env.FORIM_MONGO_DB_URI || 'mongodb://127.0.0.1:27017/forim'
};
var mongoAdapter = require('sails-mongo');
var mysqlAdapter = require('sails-mysql');
module.exports = {
  prod: {
    adapters: {
      mongo: mongoAdapter,
      mysql: mysqlAdapter
    },
    connections: {
      default: mongoConf,
      mongo: mongoConf,
      mysql: mysqlConf
    },
    defaults: {
      migrate: 'safe'
    }
  },
  dev: {
    adapters: {
      mongo: mongoAdapter,
      mysql: mysqlAdapter
    },
    connections: {
      default: mongoConf,
      mongo: mongoConf,
      mysql: mysqlConf
    }
  },
  defaults: {
    migrate: 'alter'
  }
};
