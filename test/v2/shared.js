var inc = 1;
function getUser() {
  var now = Number(new Date()) + inc++;
  var username = 'testuser' + now;
  var email = 'testuser' + now + '@gmail.com';
  var password = 'wtffffffffffff';
  return {
    username: username,
    email: email,
    password: password
  };
}
module.exports = {
  newUser: getUser,
  cookies: null,
  user: getUser(),
  thread: {
  }
};
