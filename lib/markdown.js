var Markdown = require('markdown-it');
var xss = require('xss');

var md = new Markdown();
md.set({
  html: true,
  xhtmlOut: false,
  breaks: false,
  linkify: true,
  typographer: true
});

md.renderer.rules.fence = function (tokens, idx) {
  var token = tokens[idx];
  var language = token.info && ('language-' + token.info) || '';
  language = validator.escape(language);

  return '<pre class="prettyprint ' + language + '"><code>' + validator.escape(token.content) +
    '</code></pre>';
};

md.renderer.rules.code_block = function (tokens, idx) {
  var token = tokens[idx];

  return '<pre class="prettyprint"><code>' + validator.escape(token.content) + '</code></pre>';
};

var myxss = new xss.FilterXSS({
  onIgnoreTagAttr: function (tag, name, value) {
    if (tag === 'pre' && name === 'class') {
      return name + '="' + jsxss.escapeAttrValue(value) + '"';
    }
  }
});

module.exports = function (text) {
  return '<div class="markdown-text">' + myxss.process(md.render(text || '')) + '</div>';
};
