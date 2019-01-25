myApp.controller("RecentlyAddedCtrl", function (
  $scope,
  $ionicModal,
  $stateParams,
  Navigation,
  ionicToast,
  $state,
  $ionicHistory
) {
  $scope.goBackHandler = function () {
    Navigation.gobackHandler();
  };
  if (_.isEmpty($stateParams.id) || $stateParams.id == undefined) {
    $stateParams.id = $.jStorage.get("UserId");
  }
  if ($stateParams.id) {
    Navigation.commonAPICall(
      "Product/getRecentlyAddedProducts", {
        owner: $stateParams.id
      },
      function (data) {
        if (data.data.value) {
          $scope.products = data.data.data;
          console.log("$scope.products", $scope.products);
        }
      }
    );
  } else {
    ionicToast.show("No User Selected Please Try Again", 'middle');
  }
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
