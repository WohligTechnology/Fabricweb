myApp.controller("RecentlyviewCtrl", function (
  $scope,
  $ionicActionSheet,
  $state,
  Navigation,
  $rootScope,
  $timeout,
  $ionicScrollDelegate
) {
  var dataFetcher = null;
  $scope.goBackHandler = function () {
    Navigation.gobackHandler(); //This works
  };
  $scope.showActionsheet = function () {
    // Show the action sheet
    var hideSheet = $ionicActionSheet.show({
      buttons: [{
        text: " Favourite"
      }, {
        text: " Interested"
      }],
      // destructiveText: "Delete",
      cancelText: "Cancel",
      cancel: function () {
        // add cancel code..
      },
      buttonClicked: function (index) {
        return true;
      }
    });
  };
  $scope.userId = $.jStorage.get("UserId");
  var page = 0;
  $scope.recentProducts = [];
  var recentProducts1 = [];
  var getRecentProducts = function () {
    if (!$scope.productsLoading) {
      $scope.productsLoading = true;
      page += 1;
      Navigation.commonAPICall("user/getRecentlyViewed", {
        user: $.jStorage.get("UserId"),
        page: page
      }, function (products) {
        $timeout(function () {
          $scope.pullToRefreshWorking = false;
        }, 5000);
        if ($scope.isRefreshing) {
          $scope.$broadcast('scroll.refreshComplete');
          $scope.isRefreshing = false;
        }
        $scope.productsLoading = false;
        if (products.data.value) {
          if (_.isEmpty(products.data.data.recentlyViewed)) {
            $scope.productsLoaded = true;
          } else {
            recentProducts1 = _.concat(recentProducts1, products.data.data.recentlyViewed);
            $scope.recentProducts = _.chunk(recentProducts1, 2);
          }
          $scope.$broadcast("scroll.infiniteScrollComplete");
          $timeout(function () {
            $ionicScrollDelegate.$getByHandle('mainScroll').resize();
          });
        }
      });
    }
  }
  $scope.loadMore = function () {
    if (!$scope.pullToRefreshWorking) {
      // console.log('Infinite');
      if (!!dataFetcher) dataFetcher.abort();
      getRecentProducts()
    }
  }

  $rootScope.$on("$stateChangeSuccess", function (
    event,
    toState,
    toParams,
    fromState,
    fromParams
  ) {
    if (toState.name == "recently-view") {
      getRecentProducts();
    }
  });
  $scope.scrollToTop = function () {
    $scope.pullToRefreshWorking = true;
    $timeout(function () {
      recentProducts1 = [];
      $scope.recentProducts = [];
      var page = 0;
      $scope.productsLoaded = false;
      $scope.productsLoading = false;
      if (!!dataFetcher) dataFetcher.abort();
      $scope.isRefreshing = true;
      getRecentProducts();
    }, 500);
  }
});
