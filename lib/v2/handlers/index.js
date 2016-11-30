var requires = ['message', 'oauth', 'password',
  'search', 'settings', 'thread', 'user', 'file'];
var modules = [];
for (var i = 0; i < requires.length; i++) {
  modules = modules.concat(require('./' + requires[i]));
}
module.exports = modules;
