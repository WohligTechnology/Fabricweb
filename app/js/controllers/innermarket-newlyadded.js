myApp.controller("innerMarketNewlyAddedCtrl", function (
  $scope,
  $stateParams,
  Navigation,
  $rootScope,
  $timeout,
  $ionicScrollDelegate,
  $state
) {
  var dataFetcher = null;

  $scope.goBackHandler = function () {
    Navigation.gobackHandler(); //This works
  };
  $scope.userId = $.jStorage.get("UserId");

  if ($scope.userId) {
    Navigation.commonAPICall(
      "User/getCategoryAndSubCategoryBuyer", {
        user: $scope.userId
      },
      function (data) {
        if (data.data.value) {
          $scope.filterCategory = [];
          $scope.user = data.data.data;
          var categ = _.cloneDeep($scope.user.category);
          $scope.catName = _.remove(categ, function (m) {
            if (m._id == $stateParams.categoryId) {
              return m.name;
            }
          });
          var subCat = _.cloneDeep($scope.user.subCategory);
          var subcategory = _.remove(subCat, function (m) {
            if (m.category._id == $stateParams.categoryId) {
              return m._id
            }
          })
          if (_.isEmpty(subcategory)) {
            $scope.formData.subCategory = "";
          } else {
            $scope.formData.subCategory = _.map(subcategory, '_id');
          }
          $scope.formData.blockedUser = $scope.user.blockedUser;
          getProducts();
          $scope.allowLoadMore = true;
        }
      })
  }

  // if ($stateParams.categoryId) {
  $scope.sellerProducts = [];
  var getProducts = function () {
    if (!$scope.productsLoading) {
      $scope.formData.page = $scope.formData.page + 1;
      $scope.productsLoading = true;
      Navigation.commonAPICall(
        "product/getProductForSearch",
        $scope.formData,
        function (products) {
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
              $scope.sellerProducts = _.concat(
                $scope.sellerProducts,
                products.data.data
              );
              $scope.productChunk = _.chunk($scope.sellerProducts, 2);
            }
          }
          $scope.$broadcast('scroll.infiniteScrollComplete');
          $timeout(function () {
            $ionicScrollDelegate.$getByHandle('mainScroll').resize();
          });
        }
      );
    }
  };

  $scope.formData = {
    page: 0,
    category: $stateParams.categoryId,
    type: "category",
  };
  $scope.onInfinite = function () {
    if (!$scope.pullToRefreshWorking) {
      if (!!dataFetcher) dataFetcher.abort();
      if ($scope.allowLoadMore) {
        getProducts();
      }
    }
  }

  $rootScope.$on("$stateChangeSuccess", function (
    event,
    toState,
    toParams,
    fromState,
    fromParams
  ) {
    if (toState.name == "innermarket-newly-added") {
      getProducts();
    }
  });
  $scope.scrollToTop = function () {
    $scope.pullToRefreshWorking = true;
    $timeout(function () {
      $scope.isRefreshing = true;
      $scope.sellerProducts = [];
      $scope.productChunk = [];
      $scope.formData.page = 0;
      $scope.productsLoaded = false;
      $scope.productsLoading = false;
      if (!!dataFetcher) dataFetcher.abort();
      getProducts();
    }, 500);
  }
});
