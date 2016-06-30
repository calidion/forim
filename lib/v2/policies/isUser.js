// module.exports = function (req, next) {
//   if (process.env.FORIM_BY_PASS_POLICIES > 0) {
//     req.session.user = {
//       id: '1'
//     };
//   }
//   var id = req.params.id;
//   var user = req.session.user;
//   if (user && id === user.id) {
//     return next(false);
//   }
//   return next(true);
// };
