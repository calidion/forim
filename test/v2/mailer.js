var assert = require('assert');
var mailer = require('../../lib/v2/util/mailer');

describe('v2 mailer', function () {
  it('should send mailer user activate', function (done) {
    mailer.user.activate('tech@t1bao.com', 'activate-token', 'activate-name', function (error, data) {
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
