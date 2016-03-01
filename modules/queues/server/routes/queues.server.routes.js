'use strict';

/**
 * Module dependencies
 */
var queuesPolicy = require('../policies/queues.server.policy'),
  queues = require('../controllers/queues.server.controller');

module.exports = function(app) {
  // Queues Routes
  app.route('/api/queues').all(queuesPolicy.isAllowed)
    .get(queues.list)
    .post(queues.create);

  app.route('/api/queues/:queueId').all(queuesPolicy.isAllowed)
    .get(queues.read)
    .put(queues.update)
    .delete(queues.delete);

  // Finish by binding the Queue middleware
  app.param('queueId', queues.queueByID);
};
