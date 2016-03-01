(function () {
  'use strict';

  angular
    .module('queues')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'Queues',
      state: 'queues',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'queues', {
      title: 'List Queues',
      state: 'queues.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'queues', {
      title: 'Create Queue',
      state: 'queues.create',
      roles: ['user']
    });
  }
})();
