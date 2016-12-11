var GitHub = require('github');
var github = new GitHub({
    // optional
    debug: true,
    protocol: "https",
    host: "api.github.com", // should be api.github.com for GitHub
    // pathPrefix: "/api/v3", // for some GHEs; none for GitHub
    headers: {
        "user-agent": "My-Cool-GitHub-App" // GitHub is happy with a unique user agent
    },
    Promise: require('bluebird'),
    followRedirects: false, // default: true; there's currently an issue with non-get redirects, so allow ability to disable follow-redirects
    timeout: 5000
});
module.exports = [{
  urls: ['/github/users'],
  routers: {
    get: function (req, res) {
      console.log('get');
      res.send('get');
    }
  }
}];
