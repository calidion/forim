var Waterline = require("waterline");
// Models
var User = require('./waterline/user');
var waterline = new Waterline();
var defines = [User];
for (var i = 0; i < defines.length; i++) {
  var connection = Waterline.Collection.extend(defines[i]);
  waterline.loadCollection(connection);
}

module.exports = function (config, cb) {
  waterline.initialize(config, function (error, ontology) {
    if (error) {
      return console.error(error);
    }
    cb(error, ontology);
  });
};
