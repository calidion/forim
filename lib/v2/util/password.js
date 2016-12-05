var bcrypt = require('bcryptjs');
var crypto = require('crypto');

module.exports = {
  hash: function () {
    return new Promise(function (resolve, reject) {
      bcrypt.genSalt(10, function (err, salt) {
        if (err) {
          console.error(err);
          reject(err);
        } else {
          resolve(salt);
        }
      });
    });
  },
  create: function (password, salt) {
    return crypto.createHash('md5').update(password + salt).digest('hex');
  },
  compare: function (password, salt, result) {
    return crypto.createHash('md5').update(password + salt).digest('hex') === result;
  },
  tokenize: function (str) {
    return crypto.createHash('md5').update(str).digest('hex');
  }
};
