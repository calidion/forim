var config = require('../../config').uploader;
var isLogin = require('../policies/isLogin');
var uploader = require('file-cloud-uploader');

module.exports = [{
  urls: ['upload', '/file/upload'],
  routers: {
    post: function (req, res) {
      var File = req.models.File;
      var user = req.session.user;

      req.file('file').upload(function (err, files) {
        if (err) {
          return res.json({
            success: false,
            msg: 'upload error.'
          });
        }
        var file = files[0];
        console.log(file);
        uploader(config.type, file.fd, config.config, function (result) {
          if (result.error) {
            return res.json({
              success: false,
              msg: 'upload error.'
            });
          }
          File.create({
            user: user.id,
            url: result.url,
            filename: file
          }).then(function () {
            res.json({
              success: true,
              url: result.url
            });
          }).fail(function () {
            return res.json({
              success: false,
              msg: 'upload error.'
            });
          });
        });
      });
    }
  },
  policies: {
    all: isLogin
  }
}];
