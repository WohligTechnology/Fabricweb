myApp.controller("FollowersCtrl", function ($scope, $state, Navigation, $timeout) {
  $scope.followersList = [];
  $scope.followChunk = [];
  $scope.currentPage = 1;
  var dataFetcher = null;
  $scope.getFollowersList = function () {
    if (!$scope.followersLoading) {
      $scope.followersLoading = true;
      $scope.followersData = {
        user: $.jStorage.get('userInfo')._id,
        page: $scope.currentPage++,
      }
      Navigation.commonAPIWithoutLoader("User/getFollowersList", $scope.followersData, function (data) {
        $timeout(function () {
          $scope.pullToRefreshWorking = false;
        }, 5000);
        if ($scope.isRefreshing) {
          $scope.$broadcast('scroll.refreshComplete');
          $scope.isRefreshing = false;
        }
        $scope.followersLoading = false;
        if (data.data.value) {
          if (_.isEmpty(data.data.data.followUser)) {
            $scope.followersLoaded = true;
          } else {
            $scope.followersList = _.concat($scope.followersList, data.data.data.followUser);
            $scope.followChunk = _.chunk($scope.followersList, 2);
          }
          $scope.$broadcast('scroll.infiniteScrollComplete');
        }
      });
    }
  }
  $scope.getFollowersList();

  $scope.goBackHandler = function () {
    Navigation.gobackHandler(); //This works
  };

  $scope.listDisplay = true;
  $scope.gridDisplay = false;

  $scope.changeDisplay = function () {
    $scope.listDisplay = !$scope.listDisplay;
    $scope.gridDisplay = !$scope.gridDisplay;
  }


  $scope.loadMore = function () {
    if (!$scope.pullToRefreshWorking) {
      if (!!dataFetcher) dataFetcher.abort();
      $scope.getFollowersList();
    }
  }
  $scope.scrollToTop = function () {
    $scope.pullToRefreshWorking = true;
    $timeout(function () {
      $scope.followersList = [];
      $scope.followChunk = [];
      $scope.followersData.page = 0;
      $scope.followersLoaded = false;
      $scope.followersLoading = false;
      $scope.isRefreshing = true;
      if (!!dataFetcher) dataFetcher.abort();
      $scope.getFollowersList();
    }, 500);
  }
});
