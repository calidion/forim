var settingsModule = require('node-weixin-settings');
var settingsMaker = require('./settings');

var settings = settingsMaker(settingsModule);
settings._get = function get(storage, req) {
  var self = this;
  return function (id, key, next) {
    settings._checkFunction(next);
    if (!id) {
      if (req.session.__appId) {
        id = req.session.__appId;
      }
    }
    id = String(id);
    storage.get(req, id, self._onGet(key, next));
  };
};

settings._set = function set(storage, req) {
  return function (id, key, value, next) {
    settings._checkFunction(next);
    if (key === 'app' && !id) {
      if (value.id) {
        id = value.id;
        req.session.__appId = id;
      }
    }
    id = String(id);
    storage.get(req, id, function (error, data) {
      settings._checkError(error);
      data = data || {};
      data.value = data.value || {};
      data.value[key] = value;
      storage.set(req, id, data.value, settings._onSet(value, next));
    });
  };
};
module.exports = settings;
