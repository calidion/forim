var modules = [];
var requires = ['my', 'new', 'update', 'remove', 'list', 'read', 'breath'];
for (var i = 0; i < requires.length; i++) {
  modules = modules.concat(require('./' + requires[i]));
}
module.exports = modules;

