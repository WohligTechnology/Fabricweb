myApp.controller("RedirectingCtrl", function (
  $scope,
  $state
) {
  $scope.userInfo = $.jStorage.get("userInfo");
  if (_.isEmpty($scope.userInfo)) {
    $state.go('login');
  } else {
    if ($scope.userInfo.isSeller) {
      $state.go("tab.myshop");
    } else if ($scope.userInfo.isBuyer) {
      $state.go("tab.market");
    }
  }
});
