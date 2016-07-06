var settingsModule = require('node-weixin-settings');

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
      console.log(key, error, data);
      if (error) {
        console.error(error);
        return next({});
      }
      if (data) {
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
      console.log('_get start');
      console.log(id);
      console.log(req.session.user);
      console.log(req.session.__appId);
      console.log('_get end');

      if (!id) {
        if (req.session.__appId) {
          console.log('no id');
          id = req.session.__appId;
          console.log(id);
        }
      }
      id = String(id);
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
      console.log('_set ');
      console.log(id, key, value);
      console.log('_set end');

      if (key === 'app' && !id) {
        if (value.id) {
          console.log('node start');
          console.log(value);
          id = value.id;
          req.session.__appId = id;
          console.log(req.session.__appId);
          console.log('node end');
        } else {
          throw new Error('parameter error');
        }
      }
      id = String(id);
      console.log(id, key, value);
      storage.get(req, id, function (error, data) {
        settings._checkError(error);
        data = data || {};
        data.value = data.value || {};
        data.value[key] = value;
        storage.set(req, id, data.value, settings._onSet(value, next));
      });
    };
  },
  //   _onAll: function(next) {
  //     return function onAll(error, data) {
  //       if (error) {
  //         return next({});
  //       }
  //       if (data) {
  //         next(data.value);
  //       } else {
  //         next({});
  //       }
  //     };
  //   },
  //   _all: function all(storage) {
  //     var self = this;
  //     return function(id, next) {
  //       settings._checkFunction(next);
  //       id = String(id);
  //       storage.get(id, self._onAll(next));
  //     };
  //   },
  get: function (setter, req) {
    settingsModule.registerSet(settings._set(setter, req));
    settingsModule.registerGet(settings._get(setter, req));
    // settingsModule.registerAll(settings._all(setter));
    return settingsModule;
  }
};
module.exports = settings;
