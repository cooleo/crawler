'use strict';

//Articles service used for communicating with the articles REST endpoints
angular.module('seeds').factory('Seeds', ['$resource',
  function ($resource) {
    return $resource('api/seeds/:seedId', {
      articleId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);

