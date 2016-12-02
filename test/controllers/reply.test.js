// var app = require('../../lib/app');
// var request = require('supertest')(app);
// var support = require('../support/support');
// var ReplyProxy = require('../../lib/proxy/reply');

// describe('test/controllers/reply.test.js', function () {
//   before(function (done) {
//     support.ready(done);
//   });

//   var reply1Id;

//   describe('upvote reply', function () {
//     var reply1, reply1UpCount;
//     before(function (done) {
//       ReplyProxy.getReply(reply1Id, function (err, reply) {
//         reply1 = reply;
//         reply1UpCount = reply1.ups.length;
//         done(err);
//       });
//     });

//     it('should increase', function (done) {
//       request.post('/reply/' + reply1Id + '/up')
//       .send({replyId: reply1Id})
//       .set('Cookie', support.normalUser2Cookie)
//       .end(function (err, res) {
//         res.status.should.equal(200);
//         res.body.should.eql({
//           success: true,
//           action: 'up',
//         });
//         done(err);
//       });
//     });

//     it('should decrease', function (done) {
//       request.post('/reply/' + reply1Id + '/up')
//       .send({replyId: reply1Id})
//       .set('Cookie', support.normalUser2Cookie)
//       .end(function (err, res) {
//         res.status.should.equal(200);
//         res.body.should.eql({
//           success: true,
//           action: 'down',
//         });
//         done(err);
//       });
//     });
//   });
// });
