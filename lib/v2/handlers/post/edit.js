var isPostAuthor = require('../../policies/isPostAuthor');
// var at = require('../../util/at');
var config = require('../../../config');
module.exports = {
  urls: [
    '/post/edit/:id',
    '/v2/post/edit/:id'
  ],
  routers: {
    get: function (req, res) {
      res.render('post/edit', {
        tabs: config.tabs
      });
    },
    post: function (req, res) {
      var Post = req.models.Post;
      var extracted = req.extracted;
      var post = req._post;
      Post.update(
        {
          id: extracted.params.id
        }, {
          content: extracted.body.content
        }
      ).then(function () {
        res.redirect('/thread/visit/' + post.thread + '#' + post.id);
      }).fail(function (err) {
        console.error(err);
      });
    }
  },
  policies: {
    all: isPostAuthor
  },
  validations: {
    post: {
      required: ['params', 'body'],
      params: {
        id: {
          type: 'string',
          required: true
        }
      },
      body: {
        content: {
          type: 'text',
          minLength: 10,
          required: true
        }
      }
    }
  }
};
