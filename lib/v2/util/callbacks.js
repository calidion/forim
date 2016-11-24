module.exports = {
  idData: function (res) {
    return function (data) {
      if (!data) {
        return res.errorize(res.errors.NotFound);
      }
      res.errorize(res.errors.Success, data);
    };
  },
  listData: function (res) {
    return function (error, data) {
      if (error) {
        return res.errorize(res.errors.Failed, {
          error: error,
          data: data
        });
      }
      res.errorize(res.errors.Success, data);
    };
  },
  failed: function (res) {
    return function (error) {
      return res.errorize(res.errors.Failed, error);
    };
  },
  success: function (res) {
    return function (data) {
      res.errorize(res.errors.Success, data);
    };
  }
};
