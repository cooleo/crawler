(function () {
  'use strict';

  angular
    .module('queues')
    .controller('QueuesListController', QueuesListController);

  QueuesListController.$inject = ['QueuesService'];

  function QueuesListController(QueuesService) {
    var vm = this;

    vm.queues = QueuesService.query();
  }
})();
