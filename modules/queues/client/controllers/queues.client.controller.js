(function () {
  'use strict';

  // Queues controller
  angular
    .module('queues')
    .controller('QueuesController', QueuesController);

  QueuesController.$inject = ['$scope', '$state', 'Authentication', 'queueResolve'];

  function QueuesController ($scope, $state, Authentication, queue) {
    var vm = this;

    vm.authentication = Authentication;
    vm.queue = queue;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Queue
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.queue.$remove($state.go('queues.list'));
      }
    }

    // Save Queue
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.queueForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.queue._id) {
        vm.queue.$update(successCallback, errorCallback);
      } else {
        vm.queue.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('queues.view', {
          queueId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
})();
