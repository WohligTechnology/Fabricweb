myApp.controller("FollowingCtrl", function ($scope, $state, Navigation, $ionicPopup, $timeout,
  $rootScope,
  $timeout,
  $ionicScrollDelegate) {
  var dataFetcher = null;
  $scope.formData = {
    user: $.jStorage.get('userInfo')._id,
    page: 0
  }
  $scope.followersList = [];
  $scope.follwingLoading = false;
  $scope.getFollowing = function () {
    if (!$scope.follwingLoading) {
      $scope.formData.page = $scope.formData.page + 1;
      $scope.follwingLoading = true;
      Navigation.commonAPIWithoutLoader("User/getFollowingList", $scope.formData, function (data) {
        $timeout(function () {
          $scope.pullToRefreshWorking = false;
        }, 5000);
        if ($scope.isRefreshing) {
          $scope.$broadcast('scroll.refreshComplete');
          $scope.isRefreshing = false;
        }
        $scope.follwingLoading = false;
        if (data.data.value) {
          if (_.isEmpty(data.data.data.followingUser)) {
            $scope.follwingLoaded = true;
          } else {
            $scope.followersList = _.concat(
              $scope.followersList,
              data.data.data.followingUser
            );
            $scope.followChunk = _.chunk($scope.followersList, 2);
          }
        }
        $scope.$broadcast("scroll.infiniteScrollComplete");
        $timeout(function () {
          $ionicScrollDelegate.$getByHandle('mainScroll').resize();
        });
      });
    }
  }
  $scope.getFollowing();
  $scope.onInfinite = function () {
    if (!$scope.pullToRefreshWorking) {
      if (!!dataFetcher) dataFetcher.abort();
      $scope.getFollowing();
    }
  };
  Navigation.commonAPIWithoutLoader("User/getCategoryAndSubCategoryBuyer", {
    user: $.jStorage.get('userInfo')._id
  }, function (data) {
    if (data.data.value) {
      $scope.blockedUser = data.data.data.blockedUser;
      console.log("Blockedusers:::", $scope.blockedUser);
    }
  });

  $scope.goToSellerShop = function (sellerId) {
    $scope.block = _.cloneDeep($scope.blockedUser);
    var blockUser = _.remove($scope.block, function (m) {
      return m == sellerId
    })
    if (blockUser[0] == sellerId) {
      var alertPopup = $ionicPopup.show({
        title: "Blocked",
        template: "You Have Been Blocked",
        cssClass: "logoutPopup"
      });
      $timeout(function () {
        alertPopup.close();
      }, 1000);
      // ionicToast.show("You Have been Blocked by this seller", 'middle');
    } else {
      $state.go("sellermyshop", {
        sellerId: sellerId
      });
    }
  }

  $scope.goBackHandler = function () {
    Navigation.gobackHandler(); //This works
  };

  $scope.listDisplay = true;
  $scope.gridDisplay = false;

  $scope.changeDisplay = function () {
    $scope.listDisplay = !$scope.listDisplay;
    $scope.gridDisplay = !$scope.gridDisplay;
  }
  $rootScope.$on("$stateChangeSuccess", function (
    event,
    toState,
    toParams,
    fromState,
    fromParams
  ) {
    if (toState.name == "tab.market") {
      $scope.getFollowing();
    }
  });
  $scope.scrollToTop = function () {
    $scope.pullToRefreshWorking = true;
    $timeout(function () {
      $scope.followChunk = [];
      $scope.followersList = [];
      $scope.formData.page = 0;
      $scope.follwingLoaded = false;
      if (!!dataFetcher) dataFetcher.abort();
      $scope.isRefreshing = true;
      $scope.getFollowing();
    }, 500);
  }
});
