'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Seed Schema
 */
var SeedSchema = new Schema({
  url: {
    type: String,
    default: '',
    required: 'Please fill Seed name',
    trim: true
  },
  category: {
    type: String,
    default: '',
    trim: true
  },
  siteName: {
    type: String,
    default: '',
    required: 'Please fill seed site name',
    trim: true,
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

mongoose.model('Seed', SeedSchema);
