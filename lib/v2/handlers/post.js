var requires = ['create', 'edit', 'remove'];
var modules = [];
for (var i = 0; i < requires.length; i++) {
  modules = modules.concat(require('./post/' + requires[i]));
}

module.exports = modules;
