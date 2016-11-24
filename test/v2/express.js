// var http = require('supertest');
// var app = require('../../lib/app');
// describe('v2 express', function () {
//   it('should get access denied', function (done) {
//     process.env.FORIM_BY_PASS_POLICIES = 1;
//     app.use('/v2/access/denied', function (req) {
//       req._isPermitted('sdfsfd', function () {
//       });
//     });
//     var req = http(app);
//     req.get('/v2/access/denied')
//       .expect(403)
//       .end(done);
//   });
// });
