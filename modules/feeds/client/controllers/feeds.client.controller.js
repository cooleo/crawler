'use strict';

// Feeds controller
angular.module('feeds').controller('FeedsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Feeds',
  function ($scope, $stateParams, $location, Authentication, Feeds) {
    $scope.authentication = Authentication;

    // Create new Feed
    $scope.create = function () {
      // Create new Feed object
      var feed = new Feeds({
        title: this.title,
        content: this.content
      });

      // Redirect after save
      feed.$save(function (response) {
        $location.path('feeds/' + response._id);

        // Clear form fields
        $scope.title = '';
        $scope.content = '';
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Remove existing Feed
    $scope.remove = function (feed) {
      if (feed) {
        feed.$remove();

        for (var i in $scope.feeds) {
          if ($scope.feeds[i] === feed) {
            $scope.feeds.splice(i, 1);
          }
        }
      } else {
        $scope.feed.$remove(function () {
          $location.path('feeds');
        });
      }
    };

    // Update existing feed
    $scope.update = function () {
      var feed = $scope.feed;

      feed.$update(function () {
        $location.path('feeds/' + feed._id);
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Find a list of feeds
    $scope.find = function () {
      $scope.feeds = Feeds.query();
    };

    // Find existing feed
    $scope.findOne = function () {
      $scope.feed = Feeds.get({
        feedId: $stateParams.feedId
      });
    };
  }
]);
