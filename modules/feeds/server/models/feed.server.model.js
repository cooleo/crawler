'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Feed Schema
 */
var FeedSchema = new Schema({
  title: {
    type: String,
    default: '',
    required: 'Please fill feed title',
    trim: true
  },
  content: {
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

mongoose.model('Feed', FeedSchema);
