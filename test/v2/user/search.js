// var http = require('supertest');
// var server = require('../app');
// var app;

// describe('#search users', function () {
//   before(function (done) {
//     server(function (data) {
//       app = data;
//       done();
//     });
//   });
//   it('should search user', function (done) {
//     var req = http(app);
//     req.get('/user/search?q=calidion')
//       .expect(200, function (err, res) {
//         res.body.code.should.eql(0);
//         res.body.data.items.length.should.eql(1);
//         done(err);
//       });
//   });
// });
