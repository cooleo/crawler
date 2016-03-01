'use strict';

/**
 * Module dependencies
 */
var pagesPolicy = require('../policies/pages.server.policy'),
  pages = require('../controllers/pages.server.controller');

module.exports = function(app) {
  // Pages Routes
  app.route('/api/pages').all(pagesPolicy.isAllowed)
    .get(pages.list)
    .post(pages.create);

  app.route('/api/pages/:pageId').all(pagesPolicy.isAllowed)
    .get(pages.read)
    .put(pages.update)
    .delete(pages.delete);

  // Finish by binding the Page middleware
  app.param('pageId', pages.pageByID);
};
