'use strict';

// Articles controller
angular.module('seeds').controller('SeedsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Seeds',
  function ($scope, $stateParams, $location, Authentication, Seeds) {
    $scope.authentication = Authentication;

    // Create new Article
    $scope.create = function () {
      // Create new Article object
      console.log('con chim dadata....');
      var seed = new Seeds({
        url: this.url,
        category: this.category,
        siteName: this.siteName
      });

      // Redirect after save
      seed.$save(function (response) {
        $location.path('seeds/' + response._id);

        // Clear form fields
        $scope.title = '';
        $scope.content = '';
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Remove existing seed
    $scope.remove = function (seed) {
      if (seed) {
        seed.$remove();

        for (var i in $scope.seeds) {
          if ($scope.seeds[i] === seed) {
            $scope.seeds.splice(i, 1);
          }
        }
      } else {
        $scope.seed.$remove(function () {
          $location.path('seeds');
        });
      }
    };

    // Update existing seed
    $scope.update = function () {
      var seed = $scope.seed;

      seed.$update(function () {
        $location.path('seeds/' + seed._id);
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Find a list of seeds
    $scope.find = function () {
      $scope.seeds = Seeds.query();
    };

    // Find existing seed
    $scope.findOne = function () {
      $scope.seed = Seeds.get({
        seedId: $stateParams.seedId
      });
    };
  }
]);
