var at = require('../../../lib/v2/util/at');
var assert = require('assert');
var server = require('../app');
var app;

describe('v2 at', function () {
  before(function (done) {
    server(function (data) {
      app = data;
      done();
    });
  });
  it('should be able to purify', function () {
    var content = "```sdfsf```ooo";
    var purified = at.purify(content);
    assert(purified === 'ooo');
  });

  it('should be able to purify', function () {
    var content = "```  pre   ```aaa";
    var purified = at.purify(content);
    assert(purified === 'aaa');
  });

  it('should be able to extract', function () {
    var content = "```  pre   ```aaa@ccc @ccc @sdfsdf @sdfsdfs end";
    var extracted = at.extract(content);
    assert(extracted.length === 3);
    assert(extracted.indexOf('ccc') !== -1);
    assert(extracted.indexOf('sdfsdf') !== -1);
    assert(extracted.indexOf('sdfsdfs') !== -1);
  });

  it('should parse', function (done) {
    var content = "```  pre   ```aaa@ccc @ccc @sdfsdf @sdfsdfs end";
    var req = {
      models: app.models
    };
    at.parse(req, content, {
      sender: {
        username: 'sdfsf',
        id: '1'
      },
      author: {
        username: 'sdfsf1',
        id: '2'
      },
      replier: {
        username: 'sdfsf2',
        id: '3'
      }
    }, function (messages) {
      assert(messages.length >= 0);
      done();
    });
  });
});
