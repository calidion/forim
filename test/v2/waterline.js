var assert = require('assert');
var waterline = require('../../lib/v2/waterline');
var config = require('../../lib/config');
var app = require('../../lib/app');
var v2 = require('../../lib/v2');

describe('v2 waterline', function () {
  it('should exe error', function () {
    var cb = waterline.callback(null);
    cb(true);
  });

  it('should init waterline', function (done) {
    v2(config.waterline.dev, app, function (error, ontology) {
      assert(!error);
      assert(ontology.collections.user);
      done();
    });
  });
});
