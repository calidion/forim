  var now = Number(new Date());
  var username = 'testuser' + now;
  var email = 'testuser' + now + '@gmail.com';
  var password = 'wtffffffffffff';
module.exports = {
  cookies: null,
  user: {
    username: username,
    email: email,
    password: password
  }
};
