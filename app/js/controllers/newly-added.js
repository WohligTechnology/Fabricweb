myApp.controller("newlyAddedCtrl", function (
  $scope,
  $ionicActionSheet,
  $state,
  Navigation,
  $rootScope,
  $timeout,
  $ionicScrollDelegate
) {
  $scope.goBackHandler = function () {
    Navigation.gobackHandler(); //This works
  };
  var dataFetcher = null;

  /**To get the Newly Added products by sellers */
  $scope.currPage = 0;
  $scope.productsLoading = false;
  $scope.recentlyAdded = [];
  $scope.loadData = function () {
    if (!$scope.productsLoading) {
      $scope.currPage = $scope.currPage + 1;
      $scope.productsLoading = true;
      Navigation.commonAPICall("Product/recentlyAddedViewBuyer", {
        user: $.jStorage.get('userInfo')._id,
        page: $scope.currPage
      }, function (products) {
        $scope.productsLoading = false;
        $timeout(function () {
          $scope.pullToRefreshWorking = false;
        }, 5000);
        if ($scope.isRefreshing) {
          $scope.$broadcast('scroll.refreshComplete');
          $scope.isRefreshing = false;
        }
        if (products.data.value) {
          if (_.isEmpty(products.data.data)) {
            $scope.productsLoaded = true;
          } else {
            $scope.recentlyAdded = _.concat($scope.recentlyAdded, products.data.data);
            $scope.productChunk = _.chunk($scope.recentlyAdded,
              2
            );
          }
        }
        $scope.$broadcast('scroll.infiniteScrollComplete');
        $timeout(function () {
          $ionicScrollDelegate.$getByHandle('mainScroll').resize();
        });
      });
    }
  }
  $scope.loadData();
  $scope.onInfinite = function () {
    if (!$scope.pullToRefreshWorking) {
      if (!!dataFetcher) dataFetcher.abort();
      $scope.loadData();
    }
  }


  $scope.showActionsheet = function () {
    // Show the action sheet
    var hideSheet = $ionicActionSheet.show({
      buttons: [{
          text: "Favourite"
        },
        {
          text: " Interested"
        }
      ],
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
  $rootScope.$on("$stateChangeSuccess", function (
    event,
    toState,
    toParams,
    fromState,
    fromParams
  ) {
    if (toState.name == "newly-added") {
      $scope.loadData();
    }
  });
  $scope.scrollToTop = function () {
    $scope.pullToRefreshWorking = true;
    $timeout(function () {
      $scope.isRefreshing = true;
      $scope.recentlyAdded = [];
      $scope.productChunk = [];
      $scope.currPage = 0;
      $scope.productsLoaded = false;
      $scope.productsLoading = false;
      if (!!dataFetcher) dataFetcher.abort();
      $scope.loadData();
    }, 500);
  }
});
