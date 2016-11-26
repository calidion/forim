var github = require('./oauth/github');
module.exports = [
  github.login,
  github.callback,
  github.create
];
