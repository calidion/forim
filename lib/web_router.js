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
var rss = require('./controllers/rss');
var auth = require('./middlewares/auth');
var limit = require('./middlewares/limit');
var config = require('./config');

/* eslint new-cap: 0 */
var router = express.Router();

// home page
// sitemap
router.get('/sitemap.xml', site.sitemap);
// rss
router.get('/rss', rss.index);

module.exports = router;
