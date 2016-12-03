/*!
 * nodeclub - site index controller.
 * Copyright(c) 2012 fengmk2 <fengmk2@gmail.com>
 * Copyright(c) 2012 muyuan
 * MIT Licensed
 */

/**
 * Module dependencies.
 */

var User = require('../proxy').User;
var Topic = require('../proxy').Topic;
var config = require('../config');
var EventProxy = require('eventproxy');
var cache = require('../common/cache');
var xmlbuilder = require('xmlbuilder');
var renderHelper = require('../common/render_helper');

exports.sitemap = function (req, res, next) {
  var urlset = xmlbuilder.create('urlset', {
    version: '1.0',
    encoding: 'UTF-8'
  });
  urlset.att('xmlns', 'http://www.sitemaps.org/schemas/sitemap/0.9');

  var ep = new EventProxy();
  ep.fail(next);

  ep.all('sitemap', function (sitemap) {
    res.type('xml');
    res.send(sitemap);
  });

  cache.get('sitemap', ep.done(function (sitemapData) {
    if (sitemapData) {
      ep.emit('sitemap', sitemapData);
    } else {
      Topic.getLimit5w(function (err, topics) {
        if (err) {
          return next(err);
        }
        topics.forEach(function (topic) {
          urlset.ele('url').ele('loc', 'http://' + config.site.base + '/topic/' + topic._id);
        });

        var sitemapData = urlset.end();
        // 缓存一天
        cache.set('sitemap', sitemapData, 3600 * 24);
        ep.emit('sitemap', sitemapData);
      });
    }
  }));
};

exports.appDownload = function (req, res) {
  if (/Android/i.test(req.headers['user-agent'])) {
    res.redirect('http://fir.im/ks4u');
  } else {
    res.redirect('https://itunes.apple.com/cn/app/id954734793');
  }
};
