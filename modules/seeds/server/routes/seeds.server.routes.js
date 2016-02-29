'use strict';

/**
 * Module dependencies
 */
var seedsPolicy = require('../policies/seeds.server.policy'),
  seeds = require('../controllers/seeds.server.controller');

module.exports = function(app) {
  // Seeds Routes
  app.route('/api/seeds').all(seedsPolicy.isAllowed)
    .get(seeds.list)
    .post(seeds.create);

  app.route('/api/seeds/:seedId').all(seedsPolicy.isAllowed)
    .get(seeds.read)
    .put(seeds.update)
    .delete(seeds.delete);

  // Finish by binding the Seed middleware
  app.param('seedId', seeds.seedByID);
};
