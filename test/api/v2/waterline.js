var assert = require('assert');
var waterline = require('../../../lib/v2/waterline');
var config = require('../../../lib/config');
var app = require('../../../lib/app');
var v2 = require('../../../lib/v2');

describe('v2 waterline', function () {
  it('should not init waterline', function (done) {
    waterline({}, function (error, ontology) {
      assert(!error);
      assert(ontology.collections.user);
      done();
    });
  });

  it('should not init waterline', function (done) {
    v2(config.waterline, app, function (error, ontology) {
      assert(!error);
      assert(ontology.collections.user);
      done();
    });
  });
});
