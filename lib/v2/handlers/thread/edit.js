var isLogin = require('../../policies/isLogin');
var config = require('../../../config');

function onError(err, req, res) {
  return res.showPage('notify/notify', {
    error: err
  });
}

module.exports = {
  urls: [
    '/thread/edit/:id',
    '/v2/thread/edit/:id'
  ],
  routers: {
    get: function (req, res) {
      var Thread = req.models.Thread;
      var extracted = req.extracted.params;
      Thread.findOne({
        id: extracted.id
      }).then(function (found) {
        if (!found) {
          onError('此话题不存在或已被删除。', req, res);
        }
        res.showPage('thread/edit', {
          action: 'edit',
          thread: found,
          tabs: config.tabs
        });
      }).fail(function (err) {
        console.error(err);
        onError('服务器出错!', req, res);
      });
    },
    post: function (req, res) {
      var Thread = req.models.Thread;
      var params = req.extracted.params;
      var extracted = req.extracted.body;
      Thread.findOne({
        id: params.id
      }).then(function (found) {
        if (!found) {
          return onError('此话题不存在或已被删除。', req, res);
        }
        found.title = extracted.title;
        found.tab = extracted.tab;
        found.content = extracted.content;
        found.save(function () {
          res.redirect('/thread/visit/' + found.id);
        });
      }).fail(function (err) {
        console.error(err);
        onError('服务器出错!', req, res);
      });
    }
  },
  policies: {
    all: isLogin
  },
  validations: {
    get: {
      params: {
        id: {
          type: 'string',
          required: true
        }
      }
    },
    post: {
      params: {
        id: {
          type: 'string',
          required: true
        }
      },
      body: {
        title: {
          type: 'string',
          required: true
        },
        content: {
          type: 'text',
          required: true
        },
        tab: {
          type: 'string',
          required: true
        }
      }
    }
  },
  failures: {
    policies: function (data, req, res) {
      onError('话题不能编辑，请检查是否登录!', req, res);
    },
    validation: function (data, req, res) {
      onError('输入不正确!', req, res);
    }
  }
};
