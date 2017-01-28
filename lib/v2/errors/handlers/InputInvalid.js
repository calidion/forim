module.exports = function (err, req, res) {
  console.error(err);
  console.error('validation error, please verify your input:');
  console.error(req.query);
  res.errorize(res.errors.InputInvalid);
};
