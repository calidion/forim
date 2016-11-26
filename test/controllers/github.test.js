var http = require('supertest');
var github = require('../../lib/v2/handlers/oauth/github/');
var config = require('../../lib/config');
var support = require('../support/support');
var assert = require('assert');
var server = require('../v2/app');
var app;

describe('test/controllers/github.test.js', function () {
  before(function (done) {
    support.ready(function () {
      server(function (data) {
        app = data;
        done();
      });
    });
  });
  it('should alert no github oauth', function (done) {
    var _clientID = config.oauth.github.clientID;
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
            emails: [
              { value: 'notexists@gmail.com' }
            ],
            _json: { avatar_url: 'http://avatar_url' }
          };
          next();
        },
        github.callback.routers.get);
    });
    it('should redirect to /auth/github/create when the github id not in database', function (done) {
      var req = http(app);
      req.get('/auth/github/test_callback?code=123456')
        .expect(302, function (err, res) {
          if (err) {
            return done(err);
          }
          res.headers.should.have.property('location')
            .with.endWith('/auth/github/create');
          done();
        });
    });

    // it('should redirect to / when the user is registed', function (done) {
    //   mm.data(User, 'findOne', {
    //     save: function (callback) {
    //       process.nextTick(callback);
    //     }
    //   });

    //   var req = http(app);
    //   req.get('/auth/github/test_callback?code=123456')
    //     .expect(302, function (err, res) {
    //       if (err) {
    //         return done(err);
    //       }
    //       res.headers.should.have.property('location')
    //         .with.endWith('/');
    //       done();
    //     });
    // });
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

  describe('post /auth/github/create', function () {
    before(function () {
      var displayName = 'alsotang' + +new Date();
      var username = 'alsotang' + +new Date();
      var email = 'alsotang' + Number(new Date()) + '@gmail.com';
      console.log('inside before 1');
      app.post('/auth/github/test_create', function (req, res, next) {
        req.session.user = {
          displayName: displayName,
          username: req.body.githubName || username,
          accessToken: 'a3l24j23lk5jtl35tkjglfdsf',
          emails: [
            { value: email }
          ],
          _json: { avatar_url: 'http://avatar_url.com/1.jpg' },
          id: 22
        };
        req.extracted = {
          create: '1'
        };
        next();
      }, github.create.routers.post);
    });
    it('should create a new user', function (done) {
      var userCount;
      app.models.User.count().then(function (count) {
        userCount = count;
        var req = http(app);
        req.post('/auth/github/test_create')
          .send({ create: '1' })
          .expect(302, function (err, res) {
            if (err) {
              return done(err);
            }
            res.headers.should.have.property('location')
              .with.endWith('/');
            app.models.User.count().then(function (newCount) {
              newCount.should.equal(userCount + 1);
              done();
            });
          });
      });
    });

    it('should reuse existing github account', function (done) {
      var req = http(app);
      req.post('/auth/github/test_create')
        .send({ create: '1' })
        .expect(302, function (err, res) {
          if (err) {
            return done(err);
          }
          res.headers.should.have.property('location')
            .with.endWith('/');
          done();
        });
    });
    it('should not found an old user', function (done) {
      var password = 'hehe';
      var req = http(app);
      req.post('/auth/github/test_create')
        .send({ created: 0, username: 'sdfi', password: 'sdff', githubName: 'sdfi' })
        .end(function (err, res) {
          res.status.should.equal(302);
          res.headers.location.should.equal('/');
          done(err);
        });
    });

    it('should link a old user', function (done) {
      var username = 'alsotang' + +new Date();
      var password = 'hehe';
      support.createUserByNameAndPwd(username, password, function (user) {
        var req = http(app);
        req.post('/auth/github/test_create')
          .send({ username: username, password: password, githubName: username })
          .end(function (err, res) {
            res.status.should.equal(302);
            res.headers.location.should.equal('/');
            done(err);
          });
      });
    });
  });
});
