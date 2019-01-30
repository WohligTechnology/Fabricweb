myApp.controller("SimilarProductsCtrl", function(
  $scope,
  $ionicActionSheet,
  $state,
  $stateParams,
  Navigation
) {
  $scope.goBackHandler = function() {
    Navigation.gobackHandler(); //This works
  };

  // if ($stateParams.subCategoryId) {
  // }

  $scope.formData = {
    page: 0,
    qualityType: $stateParams.qualityType
  };

  $scope.sellerProducts = [];
  var getSimilarProducts = function() {
    if (!$scope.productLoading) {
      $scope.formData.page = $scope.formData.page + 1;
      $scope.productLoading = true;
      Navigation.commonAPICall(
        "product/getProductForSimilarQualityType",
        $scope.formData,
        function(products) {
          $scope.productLoading = false;
          console.log("Products", products);
          if (products.data.value) {
            if (_.isEmpty(products.data.data)) {
              $scope.productsLoaded = true;
            } else {
              // console.log("products.data.data", products.data.data);
              $scope.sellerProducts = _.concat(
                $scope.sellerProducts,
                products.data.data
              );
              $scope.productChunk = _.chunk($scope.sellerProducts, 2);
              console.log("Initial $scope.productChunk", $scope.productChunk);
            }
            $scope.$broadcast("scroll.infiniteScrollComplete");
          } else {
            console.log("out of API");
          }
        }
      );
    }
  };

  getSimilarProducts();
  $scope.onInfinite = function() {
    console.log("Infinite");
    getSimilarProducts();
  };

  $scope.goToBuyerProductDetail = function(productId) {
    console.log("goToBuyerProductDetail");
    $state.go("buyer-product-detail", {
      id: $stateParams.id,
      productId: productId
    });
  };
  $scope.showActionsheet = function() {
    // Show the action sheet
    var hideSheet = $ionicActionSheet.show({
      buttons: [
        {
          text: " Favourite"
        },
        {
          text: " Interested"
        }
      ],
      // destructiveText: "Delete",
      cancelText: "Cancel",
      cancel: function() {
        // add cancel code..
      },
      buttonClicked: function(index) {
        return true;
      }
    });
  };
});
