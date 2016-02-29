'use strict';

// Setting up route
angular.module('seeds').config(['$stateProvider',
  function ($stateProvider) {
    // Articles state routing
    $stateProvider
        .state('seeds', {
          abstract: true,
          url: '/seeds',
          template: '<ui-view/>',
          data: {
            roles: ['user', 'admin']
          }
        })
        .state('seeds.list', {
          url: '',
          templateUrl: 'modules/seeds/views/list-seeds.client.view.html'
        })
        .state('seeds.create', {
          url: '/create',
          templateUrl: 'modules/seeds/views/create-seed.client.view.html'
        })
        .state('seeds.view', {
          url: '/:seedId',
          templateUrl: 'modules/seeds/views/view-seed.client.view.html'
        })
        .state('seeds.edit', {
          url: '/:seedId/edit',
          templateUrl: 'modules/seeds/views/edit-seed.client.view.html'
        });
  }
]);

