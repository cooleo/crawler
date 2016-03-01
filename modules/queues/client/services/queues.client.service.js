//Queues service used to communicate Queues REST endpoints
(function () {
  'use strict';

  angular
    .module('queues')
    .factory('QueuesService', QueuesService);

  QueuesService.$inject = ['$resource'];

  function QueuesService($resource) {
    return $resource('api/queues/:queueId', {
      queueId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();
