/*!
 * nodeclub - route.js
 * Copyright(c) 2012 fengmk2 <fengmk2@gmail.com>
 * MIT Licensed
 */

/**
 * Module dependencies.
 */

var express = require('express');
var site = require('./controllers/site');
var user = require('./controllers/user');
var rss = require('./controllers/rss');
var auth = require('./middlewares/auth');
var limit = require('./middlewares/limit');
var config = require('./config');

/* eslint new-cap: 0 */
var router = express.Router();

// home page
router.get('/', site.index);
// sitemap
router.get('/sitemap.xml', site.sitemap);
// mobile app download
router.get('/app/download', site.appDownload);

// user controller
// router.post('/user/:name/delete_all', auth.adminRequired, user.deleteAll); // 删除某用户所有发言
// rss
router.get('/rss', rss.index);

module.exports = router;
