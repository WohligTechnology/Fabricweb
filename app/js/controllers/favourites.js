myApp.controller("FavouritesCtrl", function (
  $scope,
  $ionicActionSheet,
  $state,
  $stateParams,
  Navigation,
  $rootScope,
  $timeout,
  $ionicScrollDelegate
) {
  var dataFetcher = null;
  $scope.FavList = [];
  if ($stateParams.id) {
    console.log("No user");
  }
  $scope.headerTitle = $stateParams.type;
  $scope.formData = {
    page: 0,
    user: $stateParams.id,
    type: $stateParams.type
  }

  $scope.getCollection = function () {
    if (!$scope.productsLoading) {
      $scope.formData.page = $scope.formData.page + 1;
      $scope.productsLoading = true;
      Navigation.commonAPICall("User/getFavList", $scope.formData, function (data) {
        $scope.productsLoading = false;
        $timeout(function () {
          $scope.pullToRefreshWorking = false;
        }, 5000);
        if ($scope.isRefreshing) {
          $scope.$broadcast('scroll.refreshComplete');
          $scope.isRefreshing = false;
        }
        // console.log("Fav Products", data.data.data)
        if (data.data.value) {
          if (_.isEmpty(data.data.data.favourite)) {
            $scope.productsLoaded = true;
          } else {
            // console.log("products.data.data", products.data.data);
            console.log("FavList", data.data.data.favourite);
            $scope.FavList = _.concat($scope.FavList, data.data.data.favourite);
            $scope.favListChunk = _.chunk($scope.FavList, 2);
            // console.log("Initial $scope.productChunk", $scope.productChunk);
          }
        } else {
          console.log("out of API");
        }
        $scope.$broadcast('scroll.infiniteScrollComplete');
        $timeout(function () {
          $ionicScrollDelegate.$getByHandle('mainScroll').resize();
        });
        console.log($scope.favListChunk);
      });
    }
  }

  $scope.getCollection();
  $scope.onInfinite = function () {
    if (!$scope.pullToRefreshWorking) {
      // console.log('Infinite');
      if (!!dataFetcher) dataFetcher.abort();
      $scope.getCollection();
    }
  }

  $rootScope.$on("getCollection", function (event, data) {
    $scope.formData.page = 0;
    $scope.getCollection();
    $scope.FavList = [];
    $scope.favListChunk = [];
  })

  $scope.goToBuyerProductDetail = function (productId) {
    console.log("goToBuyerProductDetail");
    $state.go("buyer-product-detail", {
      id: $stateParams.id,
      productId: productId
    });
  };

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
  $rootScope.$on("$stateChangeSuccess", function (
    event,
    toState,
    toParams,
    fromState,
    fromParams
  ) {
    if (toState.name == "favourites") {
      $scope.getCollection();
    }
  });
  $scope.scrollToTop = function () {
    $scope.pullToRefreshWorking = true;
    $timeout(function () {
      $scope.favListChunk = [];
      $scope.FavList = [];
      $scope.formData.page = 0;
      $scope.productsLoaded = false;
      if (!!dataFetcher) dataFetcher.abort();
      $scope.isRefreshing = true;
      init();
    }, 500);
  }
});
