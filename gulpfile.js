'use strict';

var path = require('path');
var gulp = require('gulp');
var eslint = require('gulp-eslint');
var excludeGitignore = require('gulp-exclude-gitignore');
var mocha = require('gulp-mocha');
var istanbul = require('gulp-istanbul');
var nsp = require('gulp-nsp');
var plumber = require('gulp-plumber');
var coveralls = require('gulp-coveralls');
var less = require('gulp-less');


gulp.task('less', function () {
  gulp.src('public/**/*.less')
    .pipe(less())
    .pipe(gulp.dest('public/'));
});

gulp.task('static', function () {
  return gulp.src('lib/**/*.js')
    .pipe(excludeGitignore())
    .pipe(eslint({
      rules: {
        "camelcase": 0,
        "space-before-function-paren": 0,
        "object-curly-spacing": 0,
        "no-multi-spaces": 0,
        "new-cap": 0,
        "handle-callback-err": 0,
        "spaced-comment": 0,
        "no-else-return": 0,
        "padded-blocks": 0,
        "no-multiple-empty-lines": 0,
        "comma-dangle": 0,
        "indent": 0,
        "max-params" : 0,
        "no-mixed-operators" : 0,
        "max-lines" : 0,
        "brace-style": 0,
        "no-extra-semi": 0,
        "array-bracket-spacing": 0,
        "semi": 0,
        "dot-notation": 0,
        "no-use-before-define": 0,
        "no-warning-comments": 0,
        "key-spacing": 0,
        "no-negated-condition": 0,
        "no-unneeded-ternary": 0,
        "no-regex-spaces": 0
      }
    }))
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

gulp.task('nsp', function (cb) {
  nsp({
    package: path.resolve('package.json')
  }, cb);
});

gulp.task('pre-test', function () {
  return gulp.src('lib/**/*.js')
    .pipe(excludeGitignore())
    .pipe(istanbul({
      includeUntested: true
    }))
    .pipe(istanbul.hookRequire());
});

gulp.task('test', ['pre-test'], function (cb) {
  var mochaErr;

  gulp.src(['test/**/*.js', 'test/**/*.test.js'])
    .pipe(plumber())
    .pipe(mocha({
      reporter: 'spec',
      timeout: 20000
    }))
    .on('error', function (err) {
      mochaErr = err;
      throw err;
    })
    .pipe(istanbul.writeReports())
    .on('end', function () {
      cb(mochaErr);
    });
});

gulp.task('watch', function () {
  gulp.watch(['lib/**/*.js', 'test/**'], ['test']);
});

gulp.task('coveralls', ['test'], function () {
  if (!process.env.CI) {
    return;
  }
  return gulp.src(path.join(__dirname, 'coverage/lcov.info'))
    .pipe(coveralls());
});

// gulp.task('prepublish', ['nsp']);
gulp.task('prepublish');
gulp.task('default', ['less', 'static', 'test', 'coveralls'], function () {
  process.exit();
});
