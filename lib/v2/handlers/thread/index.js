// var callbacks = require('../util/callbacks');
var modules = [];
var requires = ['create', 'edit', 'favorite', 'highlight', 'list', 'lock',
  'remove', 'stick', 'unfavorite', 'user', 'visit'];
for (var i = 0; i < requires.length; i++) {
  modules = modules.concat(require('./' + requires[i]));
}
module.exports = modules;

