(function () {
  'use strict';

  angular
    .module('pages')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('pages', {
        abstract: true,
        url: '/pages',
        template: '<ui-view/>'
      })
      .state('pages.list', {
        url: '',
        templateUrl: 'modules/pages/client/views/list-pages.client.view.html',
        controller: 'PagesListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Pages List'
        }
      })
      .state('pages.create', {
        url: '/create',
        templateUrl: 'modules/pages/client/views/form-page.client.view.html',
        controller: 'PagesController',
        controllerAs: 'vm',
        resolve: {
          pageResolve: newPage
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle : 'Pages Create'
        }
      })
      .state('pages.edit', {
        url: '/:pageId/edit',
        templateUrl: 'modules/pages/client/views/form-page.client.view.html',
        controller: 'PagesController',
        controllerAs: 'vm',
        resolve: {
          pageResolve: getPage
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Page {{ pageResolve.name }}'
        }
      })
      .state('pages.view', {
        url: '/:pageId',
        templateUrl: 'modules/pages/client/views/view-page.client.view.html',
        controller: 'PagesController',
        controllerAs: 'vm',
        resolve: {
          pageResolve: getPage
        },
        data:{
          pageTitle: 'Page {{ articleResolve.name }}'
        }
      });
  }

  getPage.$inject = ['$stateParams', 'PagesService'];

  function getPage($stateParams, PagesService) {
    return PagesService.get({
      pageId: $stateParams.pageId
    }).$promise;
  }

  newPage.$inject = ['PagesService'];

  function newPage(PagesService) {
    return new PagesService();
  }
})();
