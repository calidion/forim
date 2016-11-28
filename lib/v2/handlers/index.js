var message = require('./message');
var oauth = require('./oauth');
var requires = ['message', 'oauth', 'password',
'search', 'settings', 'thread', 'user'];
var modules = [];
for(var i = 0; i < requires.length; i++) {
  modules = modules.concat(require('./' + requires[i]));
}
module.exports = modules;