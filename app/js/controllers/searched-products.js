myApp.controller("SearchedProductsCtrl", function (
  $scope,
  Navigation,
  $stateParams,
  $state,
  ionicToast
) {
  console.log("searched products", $stateParams.id);
  $scope.goBackHandler = function () {
    Navigation.gobackHandler();
  };
  if (_.isEmpty($stateParams.id) || $stateParams.id == undefined) {
    console.log("inside first if");
    $scope.userId = $.jStorage.get("UserId");
  }
  // if ($stateParams.id) {
  Navigation.commonAPICall(
    "Product/getProductForSearch", {
      owner: $.jStorage.get("UserId"),
      name: $stateParams.keyword
    },

    function (data) {
      console.log("inside first if", data);

      if (data.data.value) {
        $scope.products = data.data.data;
        console.log("$scope.products", $scope.products);
      }
    }
  );
  // } else {
  //   ionicToast.show("No User Selected Please Try Again", 'middle');
  // }
  $scope.editProduct = function (product) {
    $state.go("edit-product", {
      id: $stateParams.id,
      product: product._id
    });
  };
  $scope.goToProductDetail = function (productId) {
    console.log("goToProductDetail");
    $state.go("product-detail", {
      id: $.jStorage.get("UserId"),
      productId: productId
    });
  };
});
