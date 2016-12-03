/*!
 * nodeclub - user controller test
 * Copyright(c) 2012 fengmk2 <fengmk2@gmail.com>
 * MIT Licensed
 */

/**
 * Module dependencies.
 */

var should = require('should');
var app = require('../../lib/app');
var request = require('supertest')(app);
var mm = require('mm');
var support = require('../support/support');
var _ = require('lodash');
var pedding = require('pedding');
var UserProxy = require('../../lib/proxy/user');
var ReplyModel = require('../../lib/models').Reply;

describe('test/controllers/user.test.js', function () {
  var testUser;
  before(function (done) {
    done = pedding(done, 2);
    support.ready(done);
    support.createUser(function (err, user) {
      testUser = user;
      done(err);
    });
  });

  // describe('#top100', function () {
  //   it('should get /users/top100', function (done) {
  //     request.get('/users/top100')
  //     .expect(200, function (err, res) {
  //       res.text.should.containEql('Top100 积分榜');
  //       done(err);
  //     });
  //   });
  // });

  describe('#delete_all', function () {
    it('should delele all ups', function (done) {
      support.createUser(function (err, user) {
        var userId = user._id;
        ReplyModel.findOne(function (err, reply) {
          should.not.exists(err);
          reply.ups.push(userId);
          reply.save(function (err, reply) {
            reply.ups.should.containEql(userId)

            request.post('/user/' + user.loginname + '/delete_all')
              .set('Cookie', support.adminUserCookie)
              .expect(200, function (err, res) {
                res.body.should.eql({ status: 'success' });

                ReplyModel.findOne({_id: reply._id}, function (err, reply) {
                  reply.ups.should.not.containEql(userId)
                  done();
                })
              })
          })
        })
      })
    })
  })
});
