var isAdmin = require('../../policies/isAdmin');

module.exports = {
  urls: [
    '/thread/stick/:id',
    '/v2/thread/stick/:id'
  ],
  routers: {
    post: function (req, res) {
      var Thread = req.models.Thread;
      var referer = req.get('referer');
      var extracted = req.extracted.params;
      Thread.findOne({
        id: extracted.id
      }).then(function (found) {
        found.sticky = !found.sticky;
        found.save(function () {
          var msg = '话题置顶成功！';
          if (!found.sticky) {
            msg = '话题取消置顶成功！';
          }
          res.showPage('notify/notify', {
            success: msg,
            referer: referer
          });
        });
      }).fail(function (e) {
        console.error(e);
        res.showPage('notify/notify', {
          success: '主题不存在或者已经被删除',
          referer: referer
        });
      });
    }
  },
  policies: {
    all: isAdmin
  },
  validations: {
    post: {
      params: {
        id: {
          type: 'string',
          required: true
        }
      }
    }
  }
};
