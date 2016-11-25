var bcrypt = require('bcrypt');
var crypto = require('crypto');

module.exports = {
  hash: function () {
    return new Promise(function (resolve, reject) {
      bcrypt.genSalt(6, function (err, salt) {
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
