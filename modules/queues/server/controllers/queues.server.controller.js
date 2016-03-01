'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Queue = mongoose.model('Queue'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Queue
 */
exports.create = function(req, res) {
  var queue = new Queue(req.body);
  queue.user = req.user;

  queue.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(queue);
    }
  });
};

/**
 * Show the current Queue
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var queue = req.queue ? req.queue.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  queue.isCurrentUserOwner = req.user && queue.user && queue.user._id.toString() === req.user._id.toString() ? true : false;

  res.jsonp(queue);
};

/**
 * Update a Queue
 */
exports.update = function(req, res) {
  var queue = req.queue ;

  queue = _.extend(queue , req.body);

  queue.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(queue);
    }
  });
};

/**
 * Delete an Queue
 */
exports.delete = function(req, res) {
  var queue = req.queue ;

  queue.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(queue);
    }
  });
};

/**
 * List of Queues
 */
exports.list = function(req, res) { 
  Queue.find().sort('-created').populate('user', 'displayName').exec(function(err, queues) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(queues);
    }
  });
};

/**
 * Queue middleware
 */
exports.queueByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Queue is invalid'
    });
  }

  Queue.findById(id).populate('user', 'displayName').exec(function (err, queue) {
    if (err) {
      return next(err);
    } else if (!queue) {
      return res.status(404).send({
        message: 'No Queue with that identifier has been found'
      });
    }
    req.queue = queue;
    next();
  });
};
