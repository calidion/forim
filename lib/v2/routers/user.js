/**
 * Forim - User Router
 * Copyright(c) 2016 calidion <calidion@gmail.com>
 * Apache 2.0 Licensed
 */

// var paginator = require('waterline-paginator');

// var allCallback = function (res) {
//   return function (error, data) {
//     if (error) {
//       return res.errorize(res.errors.Failed, {
//         error: error,
//         data: data
//       });
//     }
//     res.errorize(res.errors.Success, data);
//   };
// };

// var failed = function (res) {
//   return function (error) {
//     return res.errorize(res.errors.Failed, error);
//   };
// };

// var idCallback = function (User) {
//   return function (req, res) {
//     req._isPermitted('admin', function () {
//       var id = req.params.id;
//       User.findOne({
//         id: id
//       }).then(function (user) {
//         if (!user) {
//           return res.errorize(res.errors.NotFound);
//         }
//         res.errorize(res.errors.Success, user);
//       }).fail(failed(res));
//     });
//   };
// };

var callbacks = require('../util/callbacks');

module.exports = function (User) {
  var router = require('express').Router;
  var user = router();

  user.all('/', callbacks.list(User));
  user.all('/:id', callbacks.id(User, 'admin'));

  // user.all('/', function (req, res) {
  //   req._isPermitted('admin', function () {
  //     var limit = req.query.limit;
  //     var page = req.query.page;
  //     paginator.paginate({
  //       model: User,
  //       limit: limit,
  //       page: page
  //     }, allCallback(res));
  //   });
  // });
  // user.all('/:id', idCallback(User));
  return user;
};
// module.exports.allCallback = allCallback;
// module.exports.failed = failed;
