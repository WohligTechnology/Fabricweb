myApp.controller("BlockedListCtrl", function ($scope, $state, Navigation, $timeout) {
  $scope.BlockedList = [];
  $scope.currentPage = 1;
  var dataFetcher = null;

  $scope.getBlockedUsers = function () {
    if (!$scope.BlockedListLoading) {
      $scope.BlockedListLoading = true;
      $scope.BlockedListData = {
        user: $.jStorage.get('userInfo')._id,
        page: $scope.currentPage++,
      }
      Navigation.commonAPIWithoutLoader("BlockList/getBlockedList", $scope.BlockedListData, function (data) {
        $timeout(function () {
          $scope.pullToRefreshWorking = false;
        }, 5000);
        if ($scope.isRefreshing) {
          $scope.$broadcast('scroll.refreshComplete');
          $scope.isRefreshing = false;
        }
        $scope.BlockedListLoading = false;
        if (data.data.value) {
          if (_.isEmpty(data.data.data)) {
            $scope.BlockedListLoaded = true;
          } else {
            $scope.BlockedList = _.concat($scope.BlockedList, data.data.data);
          }
          $scope.$broadcast('scroll.infiniteScrollComplete');
        }
      });
    }
  }
  $scope.getBlockedUsers();
  $scope.loadMore = function () {
    if (!$scope.pullToRefreshWorking) {
      if (!!dataFetcher) dataFetcher.abort();
      $scope.getBlockedUsers();
    }
  }
  $scope.unBlockUser = function (userId) {
    Navigation.commonAPICall("BlockList/unblockUser", {
      blockedBy: $.jStorage.get('userInfo')._id,
      blockedTo: userId
    }, function (data) {
      $scope.getBlockedUsers();
      console.log("UnBlock", data);
    })
  }
  $scope.goBackHandler = function () {
    Navigation.gobackHandler(); //This works
  };
  $scope.scrollToTop = function () {
    $scope.pullToRefreshWorking = true;
    $timeout(function () {
      $scope.BlockedList = [];
      $scope.currentPage = 1;
      $scope.BlockedListLoaded = false;
      $scope.BlockedListLoading = false;
      $scope.isRefreshing = true;
      if (!!dataFetcher) dataFetcher.abort();
      $scope.getBlockedUsers();
    }, 500);
  }
});
