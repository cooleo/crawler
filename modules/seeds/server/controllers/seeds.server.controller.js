'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Seed = mongoose.model('Seed'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Seed
 */
exports.create = function(req, res) {
  console.log('con chim:' + JSON.stringify(req.body));
  var seed = new Seed(req.body);
  seed.user = req.user;
 console.log('save seed........');
  seed.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(seed);
    }
  });
};

/**
 * Show the current Seed
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var seed = req.seed ? req.seed.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  seed.isCurrentUserOwner = req.user && seed.user && seed.user._id.toString() === req.user._id.toString() ? true : false;

  res.jsonp(seed);
};

/**
 * Update a Seed
 */
exports.update = function(req, res) {
  var seed = req.seed ;

  seed = _.extend(seed , req.body);

  seed.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(seed);
    }
  });
};

/**
 * Delete an Seed
 */
exports.delete = function(req, res) {
  var seed = req.seed ;

  seed.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(seed);
    }
  });
};

/**
 * List of Seeds
 */
exports.list = function(req, res) { 
  Seed.find().sort('-created').populate('user', 'displayName').exec(function(err, seeds) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(seeds);
    }
  });
};

/**
 * Seed middleware
 */
exports.seedByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Seed is invalid'
    });
  }

  Seed.findById(id).populate('user', 'displayName').exec(function (err, seed) {
    if (err) {
      return next(err);
    } else if (!seed) {
      return res.status(404).send({
        message: 'No Seed with that identifier has been found'
      });
    }
    req.seed = seed;
    next();
  });
};
