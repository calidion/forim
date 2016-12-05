var assert = require('assert');

module.exports = function (settingsModule) {
  /* eslint space-before-function-paren: 0 */
  var settings = {
    _checkFunction: function checkFunction(next) {
      if (!(next instanceof Function)) {
        throw new Error('Function Required');
      }
    },
    _checkError: function checkError(error) {
      if (error) {
        console.error('Something unknown happen!');
        throw Error('Unknown Error!');
      }
    },
    _onGet: function (key, next) {
      return function (error, data) {
        if (error) {
          console.error(error);
          return next({});
        }
        if (data && data.value) {
          next(data.value[key]);
        } else {
          next({});
        }
      };
    },
    _get: function get(storage, req) {
      var self = this;
      return function (id, key, next) {
        settings._checkFunction(next);
        storage.get(req, id, self._onGet(key, next));
      };
    },
    _onSet: function _onSet(value, next) {
      return function onSet(error) {
        if (error) {
          return next(null);
        }
        next(value);
      };
    },
    _set: function set(storage, req) {
      return function (id, key, value, next) {
        settings._checkFunction(next);
        assert(id);
        id = String(id);
        storage.get(req, id, function (error, data) {
          settings._checkError(error);
          data = data || {};
          data.value = data.value || {};
          data.value[key] = value;
          storage.set(req, id, data.value, settings._onSet(value, next));
        });
      };
    },
    // _onAll: function (next) {
    //   return function onAll(error, data) {
    //     if (error) {
    //       return next({});
    //     }
    //     if (data) {
    //       next(data.value);
    //     } else {
    //       next({});
    //     }
    //   };
    // },
    // _all: function all(storage, req) {
    //   return function (id, next) {
    //     settings._checkFunction(next);
    //     id = String(id);
    //     storage.get(req, id, settings._onAll(next));
    //   };
    // },
    get: function (setter, req) {
      settingsModule.registerSet(settings._set(setter, req));
      settingsModule.registerGet(settings._get(setter, req));
      // settingsModule.registerAll(settings._all(setter, req));
      return settingsModule;
    }
  };
  return settings;
};
