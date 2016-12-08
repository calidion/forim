var http = require('supertest');
var github = require('../../lib/v2/handlers/oauth/github/');
var config = require('../../lib/config');
var assert = require('assert');
var server = require('./app');
var app;
/* eslint camelcase: ["error", {properties: "never"}] */

describe('v2 github', function () {
  before(function (done) {
    server(function (data) {
      app = data;
      done();
    });
  });
  it('should alert no github oauth', function (done) {
    config.oauth.github.clientID = 'your GITHUB_CLIENT_ID';
    var req = http(app);
    req.get('/auth/github')
      .expect(200)
      .end(function (err, res) {
        assert(!err);
        assert.equal(res.text, 'call the admin to set github oauth.');
        done();
      });
  });
  it('should 302 when get /auth/github', function (done) {
    var _clientID = config.oauth.github.clientID;
    config.oauth.github.clientID = 'aldskfjo2i34j2o3';
    var req = http(app);
    req.get('/auth/github')
      .expect(302, function (err, res) {
        if (err) {
          return done(err);
        }
        res.headers.should.have.property('location')
          .with.startWith('https://github.com/login/oauth/authorize?');
        config.oauth.github.clientID = _clientID;
        done();
      });
  });

  it('should redirect to github oauth page', function (done) {
    var _clientID = config.oauth.github.clientID;
    config.oauth.github.clientID = 'clientID chenged';
    var req = http(app);
    req.get('/auth/github')
      .expect(302, function (err, res) {
        if (err) {
          return done(err);
        }
        res.headers.location.should.containEql('https://github.com/login/oauth/authorize?');
        config.oauth.github.clientID = _clientID;
        done();
      });
  });

  describe('get /auth/github/callback', function () {
    before(function () {
      app.get('/auth/github/test_callback',
        function (req, res, next) {
          req.user = {
            id: 'notexists',
            username: 'sdfsdf',
            accessToken: 'asdfsff',
            emails: [
              {
                value: 'notexists@gmail.com'
              }
            ],
            _json: {
              avatar_url: 'http://avatar_url'
            }
          };
          next();
        },
        github.callback.routers.get);
    });
    it('should create user when the github id not in database', function (done) {
      var req = http(app);
      req.get('/auth/github/test_callback?code=123456')
        .expect(302, function (err, res) {
          if (err) {
            return done(err);
          }
          res.headers.should.have.property('location')
            .with.endWith('/');
          done();
        });
    });
  });

  describe('get /auth/github/create', function () {
    it('should 200', function (done) {
      var req = http(app);
      req
        .get('/auth/github/create')
        .expect(200, function (err, res) {
          if (err) {
            return done(err);
          }
          res.text.should.containEql('/auth/github/create');
          done();
        });
    });
  });

  // describe('post /auth/github/create', function () {
  //   before(function () {
  //     var displayName = 'forim' + Number(new Date());
  //     var username = 'forim' + Number(new Date());
  //     var email = 'forim' + Number(new Date()) + '@gmail.com';
  //     app.post('/auth/github/test_create', function (req, res, next) {
  //       req.session.user = {
  //         displayName: displayName,
  //         username: req.body.githubName || username,
  //         accessToken: 'a3l24j23lk5jtl35tkjglfdsf',
  //         emails: [
  //           {
  //             value: email
  //           }
  //         ],
  //         _json: {
  //           avatar_url: 'http://avatar_url.com/1.jpg'
  //         },
  //         id: 22
  //       };
  //       req.extracted = {
  //         body: {
  //           create: '1'
  //         }
  //       };
  //       next();
  //     }, github.create.routers.post);
  //   });
  //   it('should create a new user', function (done) {
  //     Promise.all([
  //       app.models.User.count(),
  //       new Promise(function (resolve) {
  //         var req = http(app).post('/auth/github/test_create');
  //         req
  //           .send({
  //             create: '1'
  //           })
  //           .expect(302, function (err, res) {
  //             if (err) {
  //               return done(err);
  //             }
  //             res.headers.should.have.property('location')
  //               .with.endWith('/');
  //             resolve(app.models.User.count());
  //           });
  //       })
  //     ])
  //       .then(function (data) {
  //         var userCount = data[0];
  //         var count = data[1];
  //         count.should.equal(userCount + 1);
  //         done();
  //       });
  //   });

  //   it('should reuse existing github account', function (done) {
  //     var req = http(app);
  //     req.post('/auth/github/test_create')
  //       .send({
  //         create: '1'
  //       })
  //       .expect(302, function (err, res) {
  //         if (err) {
  //           return done(err);
  //         }
  //         res.headers.should.have.property('location')
  //           .with.endWith('/');
  //         done();
  //       });
  //   });
  //   it('should not found an old user', function (done) {
  //     var req = http(app);
  //     req.post('/auth/github/test_create')
  //       .send({
  //         created: 0,
  //         username: 'sdfi',
  //         password: 'sdff',
  //         githubName: 'sdfi'
  //       })
  //       .end(function (err, res) {
  //         res.status.should.equal(302);
  //         res.headers.location.should.equal('/');
  //         done(err);
  //       });
  //   });

    // it('should link a old user', function (done) {
    //   var username = 'forim' + +new Date();
    //   var password = 'hehe';
    //   support.createUserByNameAndPwd(username, password, function (user) {
    //     var req = http(app);
    //     req.post('/auth/github/test_create')
    //       .send({ username: username, password: password, githubName: username })
    //       .end(function (err, res) {
    //         res.status.should.equal(302);
    //         res.headers.location.should.equal('/');
    //         done(err);
    //       });
    //   });
    // });
  // });
});
