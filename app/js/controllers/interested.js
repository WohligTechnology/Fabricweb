myApp.controller("InterestedCtrl", function (
  $scope,
  $ionicActionSheet,
  $state,
  $stateParams,
  Navigation
) {

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
    if (!$scope.productLoading) {
      $scope.formData.page = $scope.formData.page + 1;
      $scope.productLoading = true;
      Navigation.commonAPICall("User/getFavList", $scope.formData, function (data) {
        $scope.productLoading = false;
        // console.log("Fav Products", data.data.data)
        if (data.data.value) {
          if (_.isEmpty(data.data.data.interested)) {
            $scope.productsLoaded = true;
          } else {
            // console.log("products.data.data", products.data.data);
            console.log("FavList", data.data.data.interested);
            $scope.FavList = _.concat($scope.FavList, data.data.data.interested);
            $scope.favListChunk = _.chunk($scope.FavList, 2);
            // console.log("Initial $scope.productChunk", $scope.productChunk);
          }
          $scope.$broadcast('scroll.infiniteScrollComplete');
        } else {
          console.log("out of API");
        }
      });
    }
  }

  getProducts();
  $scope.onInfinite = function () {
    // console.log('Infinite');
    getProducts();
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
});
