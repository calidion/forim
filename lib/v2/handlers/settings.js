var modules = require('./weixin/settings');
var requires = [];
for (var i = 0; i < requires.length; i++) {
  modules = modules.concat(require('./settings/' + requires[i]));
}
module.exports = modules;
