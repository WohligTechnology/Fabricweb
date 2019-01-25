myApp.controller("BuyerInnerShopCtrl", function (
  $scope,
  $ionicModal,
  $ionicActionSheet,
  $stateParams,
  Navigation,
  ionicToast,
  $ionicPopup,
  $state
) {
  $scope.goBackHandler = function () {
    Navigation.gobackHandler(); //This works
  };
  $scope.getProducts = function () {
    var obj = {};
    obj.owner = $stateParams.sellerId;
    if ($stateParams.subCategory) {
      obj.subCategory = $stateParams.subCategory;
    }
    if ($stateParams.category) {
      obj.category = $stateParams.category;
    }
    Navigation.commonAPICall("Product/getProductsWithLimit", obj, function (
      data
    ) {
      $scope.productsChunk = _.chunk(data.data.data, 2);
      $scope.sortProductModal ? $scope.closeSortProductModal() : '';
    });
  };
  $scope.getProducts();

  $scope.goToBuyerProductDetail = function (productId) {
    console.log("goToBuyerProductDetail");
    $state.go("buyer-product-detail", {
      id: $.jStorage.get('userInfo')._id,
      productId: productId
    });
  };
})
