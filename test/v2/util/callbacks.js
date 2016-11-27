var callbacks = require('../../../lib/v2/util/callbacks');
var assert = require('assert');
describe('v2 callbacks', function () {
  it('should list data', function (done) {
    var res = {
      errorize: function (error, data) {
        assert(error === 'hood');
        assert(data.error);
        assert(data.data === undefined);
        done();
      },
      errors: {
        Failed: 'hood'
      }
    };
    var cb = callbacks.listData(res);
    cb(true);
  });

  it('should failed', function (done) {
    var failed = callbacks.failed;
    var res = {
      errorize: function (error, data) {
        assert(error === 'hood');
        assert(data);
        done();
      },
      errors: {
        Failed: 'hood'
      }
    };
    var cb = failed(res);
    cb(true);
  });
});
