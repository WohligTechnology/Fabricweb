myApp.controller("FollowersCtrl", function ($scope, $state, Navigation) {

  Navigation.commonAPIWithoutLoader("User/getFollowersList", {
    user: $.jStorage.get('userInfo')._id,
    page: 1
  }, function (data) {
    if (data.data.value) {
      // console.log("FOllowers List::", data);
      $scope.followersList = data.data.data.followUser;
      $scope.followChunk = _.chunk($scope.followersList, 2);
    }
  });
  $scope.goBackHandler = function () {
    Navigation.gobackHandler(); //This works
  };

  $scope.listDisplay = true;
  $scope.gridDisplay = false;

  $scope.changeDisplay = function () {
    $scope.listDisplay = !$scope.listDisplay;
    $scope.gridDisplay = !$scope.gridDisplay;
  }
});
