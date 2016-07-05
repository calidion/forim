module.exports = {
  prod: {
    adapters: {
      mongo: require('sails-mongo'),
      mysql: require('sails-mysql')
    },
    connections: {
      default: {
        adapter: 'mongo',
        url: process.env.FORIM_MONGO_DB_URI || 'mongodb://192.168.3.56:27017/forim'
      },
      mongo: {
        adapter: 'mongo',
        url: process.env.FORIM_MONGO_DB_URI || 'mongodb://192.168.3.56:27017/forim'
      },
      mysql: {
        adapter: 'mysql',
        host: process.env.FORIM_MYSQL_DB_HOST || '127.0.0.1',
        user: process.env.FORIM_MYSQL_DB_USER || 'forim',
        password: process.env.FORIM_MYSQL_DB_PASSWORD || 'forim',
        database: process.env.FORIM_MYSQL_DB_NAME || 'forim',
        prefix: process.env.FORIM_MYSQL_DB_PREFIX || ''
      }
    },
    defaults: {
      migrate: 'safe'
    }
  },
  dev: {
    adapters: {
      mongo: require('sails-mongo'),
      mysql: require('sails-mysql')
    },
    connections: {
      default: {
        adapter: 'mongo',
        url: process.env.FORIM_MONGO_DB_URI || 'mongodb://192.168.3.56:27017/forim'
      },
      mongo: {
        adapter: 'mongo',
        url: process.env.FORIM_MONGO_DB_URI || 'mongodb://192.168.3.56:27017/forim'
      },
      mysql: {
        adapter: 'mysql',
        host: process.env.FORIM_MYSQL_DB_HOST || '127.0.0.1',
        user: process.env.FORIM_MYSQL_DB_USER || 'forim',
        password: process.env.FORIM_MYSQL_DB_PASSWORD || 'forim',
        database: process.env.FORIM_MYSQL_DB_NAME || 'forim',
        prefix: process.env.FORIM_MYSQL_DB_PREFIX || ''
      }
    },
    defaults: {
      migrate: 'alter'
    }
  }
};
