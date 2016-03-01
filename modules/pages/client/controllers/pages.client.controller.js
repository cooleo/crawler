(function () {
  'use strict';

  // Pages controller
  angular
    .module('pages')
    .controller('PagesController', PagesController);

  PagesController.$inject = ['$scope', '$state', 'Authentication', 'pageResolve'];

  function PagesController ($scope, $state, Authentication, page) {
    var vm = this;

    vm.authentication = Authentication;
    vm.page = page;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Page
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.page.$remove($state.go('pages.list'));
      }
    }

    // Save Page
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.pageForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.page._id) {
        vm.page.$update(successCallback, errorCallback);
      } else {
        vm.page.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('pages.view', {
          pageId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
})();
