//Pages service used to communicate Pages REST endpoints
(function () {
  'use strict';

  angular
    .module('pages')
    .factory('PagesService', PagesService);

  PagesService.$inject = ['$resource'];

  function PagesService($resource) {
    return $resource('api/pages/:pageId', {
      pageId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();
