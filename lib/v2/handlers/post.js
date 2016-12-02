var requires = ['create'];
var modules = [];
for (var i = 0; i < requires.length; i++) {
  modules = modules.concat(require('./post/' + requires[i]));
}

module.exports = modules;
