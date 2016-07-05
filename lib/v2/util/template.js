var nunjucks = require('nunjucks');
var path = require('path');

nunjucks.configure({
  autoescape: true
});

module.exports = nunjucks.configure(
  path.resolve(__dirname, '../views'), {
    watch: true
  });
