myApp.controller("SearchBuyersCtrl", function ($scope) {
  $scope.toggleView = true;
  $scope.gridListView = function () {
    $scope.toggleView = !$scope.toggleView;
  };
});
