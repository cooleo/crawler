'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Queue Schema
 */
var QueueSchema = new Schema({
  queued: {
    type:Number

  },
  crawled: {
    type: Number
  },
  worker_uuid: {
    type: String
  },
  url: {
    type: String
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

mongoose.model('Queue', QueueSchema);
