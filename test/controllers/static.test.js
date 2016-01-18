var app = require('../../app');
var request = require('supertest')(app);

describe('test/controllers/static.test.js', function () {

  it('should get /robots.txt', function (done) {
    request.get('/robots.txt').expect(200)
      .end(function (err, res) {
        res.text.should.containEql('User-Agent');
        done(err);
      });
  });
});
