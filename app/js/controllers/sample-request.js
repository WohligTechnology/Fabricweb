myApp.controller("SampleRequestCtrl", function (
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

  var getProducts = function () {
    if (!$scope.productsLoading) {
      $scope.formData.page = $scope.formData.page + 1;
      $scope.productsLoading = true;
      Navigation.commonAPICall("User/getFavList", $scope.formData, function (data) {
        $timeout(function () {
          $scope.pullToRefreshWorking = false;
        }, 5000);
        if ($scope.isRefreshing) {
          $scope.$broadcast('scroll.refreshComplete');
          $scope.isRefreshing = false;
        }
        $scope.productsLoading = false;
        // console.log("Fav Products", data.data.data)
        if (data.data.value) {
          if (_.isEmpty(data.data.data.sampleRequest)) {
            $scope.productsLoaded = true;
          } else {
            // console.log("products.data.data", products.data.data);
            console.log("FavList", data.data.data.sampleRequest);
            $scope.FavList = _.concat($scope.FavList, data.data.data.sampleRequest);
            $scope.favListChunk = _.chunk($scope.FavList, 2);
            // console.log("Initial $scope.productChunk", $scope.productChunk);
          }
        } else {
          console.log("out of API");
        }
        $scope.$broadcast("scroll.infiniteScrollComplete");
        $timeout(function () {
          $ionicScrollDelegate.$getByHandle('mainScroll').resize();
        });
      });
    }
  }

  getProducts();
  $scope.onInfinite = function () {
    if (!$scope.pullToRefreshWorking) {
      // console.log('Infinite');
      if (!!dataFetcher) dataFetcher.abort();
      getProducts();
    }
  }


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
    if (toState.name == "sample-request") {
      getProducts();
    }
  });
  $scope.scrollToTop = function () {
    $scope.pullToRefreshWorking = true;
    $timeout(function () {
      $scope.favListChunk = [];
      $scope.FavList = [];
      $scope.formData.page = 0;
      $scope.productsLoaded = false;
      $scope.productsLoading = false;
      if (!!dataFetcher) dataFetcher.abort();
      $scope.isRefreshing = true;
      getProducts();
    }, 500);
  }
});
