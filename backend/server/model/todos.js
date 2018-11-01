'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TodosSchema = new Schema({
  author: String,
  task: String
});

module.exports = mongoose.model('Todo', TodosSchema);
