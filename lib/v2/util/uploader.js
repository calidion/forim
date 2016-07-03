var uploader = require('file-cloud-uploader');
var os = require('os');
var path = require('path');
var fs = require('fs');

module.exports = function (conf, stream, filename, next) {
  var saveTo = path.join(os.tmpDir(), path.basename(filename));
  stream.pipe(fs.createWriteStream(saveTo)).on('finish', function () {
    var type = conf.default;
    var config = conf.adapters[type];
    uploader(type, saveTo, config, next);
  });
};
