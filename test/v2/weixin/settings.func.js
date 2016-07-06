var settings = require('../../../lib/v2/weixin/settings.session');
var assert = require('assert');

describe('v2 weixin api', function () {
  it('should be able to test _onSet', function (done) {
    var onSet = settings._onSet(null, function () {
      done();
    });
    onSet(true);
  });

  it('should be able to test _onGet', function (done) {
    var onGet = settings._onGet(null, function () {
      done();
    });
    onGet(true);
  });

  it('should be able to test _checkError', function () {
    var catched = false;
    try {
      settings._checkError(true);
    } catch (e) {
      catched = true;
    }
    assert(catched);
  });

  it('should be able to test _checkFunction', function () {
    var catched = false;
    try {
      settings._checkFunction(true);
    } catch (e) {
      catched = true;
    }
    assert(catched);
  });
});
