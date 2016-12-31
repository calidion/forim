var assert = require('assert');
var mailer = require('../../lib/v2/util/mailer');

describe('vig mailer', function () {
  it('should send mailer user activate', function (done) {
    mailer.user.activate(process.env.FORIM_MAIL_EMAIL,
      'activate-token', 'activate-name',
      function (error) {
        assert(!error);
        done();
      });
  });

  it('should send mailer password reset', function (done) {
    mailer.user.password.reset(process.env.FORIM_MAIL_EMAIL, 'reset-token',
      'reset-name', function (error) {
        assert(!error);
        done();
      });
  });
});
