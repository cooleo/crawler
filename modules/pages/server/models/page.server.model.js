'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Page Schema
 */
var PageSchema = new Schema({
  url: {
    type: String,
    default: ''
  },
  html: {
    type: String,
    default: ''
  },
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Page', PageSchema);
