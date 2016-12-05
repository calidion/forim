var modules = [];
var requires = ['main'];
for (var i = 0; i < requires.length; i++) {
  modules = modules.concat(require('./site/' + requires[i]));
}
module.exports = modules;
