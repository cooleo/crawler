(function () {
  'use strict';

  angular
    .module('pages')
    .controller('PagesListController', PagesListController);

  PagesListController.$inject = ['PagesService'];

  function PagesListController(PagesService) {
    var vm = this;

    vm.pages = PagesService.query();
  }
})();
