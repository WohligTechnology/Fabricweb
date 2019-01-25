myApp.controller("BuyerSearchedProductsCtrl", function (
  $scope,
  Navigation,
  $stateParams,
  $state,
  ionicToast
) {
  $scope.goBackHandler = function () {
    Navigation.gobackHandler();
  };
  if (_.isEmpty($stateParams.id) || $stateParams.id == undefined) {
    $scope.userId = $.jStorage.get("UserId");
  }
  if ($scope.userId) {
    Navigation.commonAPICall(
      "User/getCategoryAndSubCategoryBuyer", {
        user: $scope.userId
      },
      function (data) {

        if (data.data.value) {
          $scope.filterCategory = [];
          $scope.user = data.data.data;

          $scope.formData.blockedUser = $scope.user.blockedUser;
          console.log("$scope.formData.blockedUser", $scope.formData.blockedUser);
          getProducts();

          $scope.onInfinite = function () {
            // console.log('Infinite');
            getProducts();
          }
        }
      })
  }

  /**
   * Common function To get all products as per keyword
   */

  $scope.productChunk = [];
  $scope.sellerProducts = [];
  var getProducts = function () {
    console.log("$scope.formData", $scope.formData);
    if (!$scope.productLoading) {
      $scope.formData.page = $scope.formData.page + 1;
      $scope.productLoading = true;
      Navigation.commonAPICall("Product/getProductForSearch", $scope.formData, function (products) {
        $scope.productLoading = false;
        // console.log("Products", products)
        if (products.data.value) {
          if (_.isEmpty(products.data.data)) {
            $scope.productsLoaded = true;
          } else {
            $scope.sellerProducts = _.concat($scope.sellerProducts, products.data.data);
            $scope.productChunk = _.chunk($scope.sellerProducts,
              2
            );
          }
          $scope.$broadcast('scroll.infiniteScrollComplete');
        } else {
          console.log("out of API");
        }
      });
    }
  }

  $scope.formData = {
    page: 0,
    name: $stateParams.keyword,
    category: "",
    subCategory: ""
  }

  $scope.goToBuyerProductDetail = function (productId) {
    $state.go("buyer-product-detail", {
      id: $.jStorage.get("UserId"),
      productId: productId
    });
  };

});
