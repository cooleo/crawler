(function () {
  'use strict';

  angular
    .module('pages')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'Pages',
      state: 'pages',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'pages', {
      title: 'List Pages',
      state: 'pages.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'pages', {
      title: 'Create Page',
      state: 'pages.create',
      roles: ['user']
    });
  }
})();
