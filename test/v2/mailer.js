var assert = require('assert');
var mailer = require('../../lib/v2/util/mailer');

describe('v2 mailer', function () {
  it('should send mailer user active', function (done) {
    mailer.user.active('tech@t1bao.com', 'active-token', 'active-name', function (error, data) {
      console.log(error, data);
      assert(!error);
      done();
    });
  });

  it('should send mailer password reset', function (done) {
    mailer.user.password.reset('tech@t1bao.com', 'reset-token', 'reset-name', function (error, data) {
      console.log(error, data);
      assert(!error);
      done();
    });
  });
});
