'use strict';

// Configuring the Articles module
angular.module('seeds').run(['Menus',
  function (Menus) {
    // Add the articles dropdown item
    Menus.addMenuItem('topbar', {
      title: 'Seeds',
      state: 'seeds',
      type: 'dropdown'
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'seeds', {
      title: 'List Seeds',
      state: 'seeds.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'seeds', {
      title: 'Create Seeds',
      state: 'seeds.create'
    });
  }
]);

