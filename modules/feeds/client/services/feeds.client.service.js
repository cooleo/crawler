'use strict';

//Articles service used for communicating with the articles REST endpoints
angular.module('feeds').factory('Feeds', ['$resource',
  function ($resource) {
    return $resource('api/feeds/:feedId', {
      articleId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);
