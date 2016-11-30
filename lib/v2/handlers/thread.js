var create = require('./thread/create');
var visit = require('./thread/visit');
var edit = require('./thread/edit');
var remove = require('./thread/remove');
var favorite = require('./thread/favorite');
var unfavorite = require('./thread/unfavorite');
var stick = require('./thread/stick');
var lock = require('./thread/lock');
var highlight = require('./thread/highlight');

module.exports = [
  visit, favorite, unfavorite,
  create, edit, remove,
  stick, lock, highlight
];
