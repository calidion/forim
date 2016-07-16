var assert = require('assert');
var settings = require('../../lib/v2/controllers/settings');

describe('v2 settings', function () {
  it('should send mailer user activate', function (done) {
    var func = settings.__onFailed({
      errorize: function (error, data) {
        assert(error.code === -1);
        assert(data === true);
        done();
      },
      errors: {
        Failed: {
          code: -1
        }
      }
    });
    func(true);
  });
});
