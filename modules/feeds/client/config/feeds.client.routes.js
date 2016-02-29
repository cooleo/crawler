/*(function () {
  'use strict';

  angular
    .module('feeds')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('feeds', {
        abstract: true,
        url: '/feeds',
        template: '<ui-view/>'
      })
      .state('feeds.list', {
        url: '',
        templateUrl: 'modules/feeds/client/views/list-feeds.client.view.html',
        controller: 'FeedsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Feeds List'
        }
      })
      .state('feeds.create', {
        url: '/create',
        templateUrl: 'modules/feeds/client/views/form-feed.client.view.html',
        controller: 'FeedsController',
        controllerAs: 'vm',
        resolve: {
          feedResolve: newFeed
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle : 'Feeds Create'
        }
      })
      .state('feeds.edit', {
        url: '/:feedId/edit',
        templateUrl: 'modules/feeds/client/views/form-feed.client.view.html',
        controller: 'FeedsController',
        controllerAs: 'vm',
        resolve: {
          feedResolve: getFeed
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Feed {{ feedResolve.name }}'
        }
      })
      .state('feeds.view', {
        url: '/:feedId',
        templateUrl: 'modules/feeds/client/views/view-feed.client.view.html',
        controller: 'FeedsController',
        controllerAs: 'vm',
        resolve: {
          feedResolve: getFeed
        },
        data:{
          pageTitle: 'Feed {{ articleResolve.name }}'
        }
      });
  }

  getFeed.$inject = ['$stateParams', 'FeedsService'];

  function getFeed($stateParams, FeedsService) {
    return FeedsService.get({
      feedId: $stateParams.feedId
    }).$promise;
  }

  newFeed.$inject = ['FeedsService'];

  function newFeed(FeedsService) {
    return new FeedsService();
  }
})();


*/




'use strict';

// Setting up route
angular.module('feeds').config(['$stateProvider',
  function ($stateProvider) {
    // Articles state routing
    $stateProvider
        .state('feeds', {
          abstract: true,
          url: '/feeds',
          template: '<ui-view/>',
          data: {
            roles: ['user', 'admin']
          }
        })
        .state('feeds.list', {
          url: '',
          templateUrl: 'modules/feeds/views/list-feeds.client.view.html'
        })
        .state('feeds.create', {
          url: '/create',
          templateUrl: 'modules/feeds/views/create-feed.client.view.html'
        })
        .state('feeds.view', {
          url: '/:feedId',
          templateUrl: 'modules/feeds/views/view-feed.client.view.html'
        })
        .state('feeds.edit', {
          url: '/:feedId/edit',
          templateUrl: 'modules/feeds/views/edit-feed.client.view.html'
        });
  }
]);

