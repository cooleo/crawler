(function () {
  'use strict';

  angular
    .module('queues')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('queues', {
        abstract: true,
        url: '/queues',
        template: '<ui-view/>'
      })
      .state('queues.list', {
        url: '',
        templateUrl: 'modules/queues/client/views/list-queues.client.view.html',
        controller: 'QueuesListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Queues List'
        }
      })
      .state('queues.create', {
        url: '/create',
        templateUrl: 'modules/queues/client/views/form-queue.client.view.html',
        controller: 'QueuesController',
        controllerAs: 'vm',
        resolve: {
          queueResolve: newQueue
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle : 'Queues Create'
        }
      })
      .state('queues.edit', {
        url: '/:queueId/edit',
        templateUrl: 'modules/queues/client/views/form-queue.client.view.html',
        controller: 'QueuesController',
        controllerAs: 'vm',
        resolve: {
          queueResolve: getQueue
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Queue {{ queueResolve.name }}'
        }
      })
      .state('queues.view', {
        url: '/:queueId',
        templateUrl: 'modules/queues/client/views/view-queue.client.view.html',
        controller: 'QueuesController',
        controllerAs: 'vm',
        resolve: {
          queueResolve: getQueue
        },
        data:{
          pageTitle: 'Queue {{ articleResolve.name }}'
        }
      });
  }

  getQueue.$inject = ['$stateParams', 'QueuesService'];

  function getQueue($stateParams, QueuesService) {
    return QueuesService.get({
      queueId: $stateParams.queueId
    }).$promise;
  }

  newQueue.$inject = ['QueuesService'];

  function newQueue(QueuesService) {
    return new QueuesService();
  }
})();
