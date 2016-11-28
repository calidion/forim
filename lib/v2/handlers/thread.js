var create = require('./thread/create');
var visit = require('./thread/visit');
var edit = require('./thread/edit');
var remove = require('./thread/remove');
var favorite = require('./thread/favorite');
var unfavorite = require('./thread/unfavorite');

module.exports = [favorite, unfavorite, create, visit, edit, remove];
