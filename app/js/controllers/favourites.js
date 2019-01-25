myApp.controller("FavouritesCtrl", function (
  $scope,
  $ionicActionSheet,
  $state,
  $stateParams,
  Navigation,
  $rootScope
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

  $scope.getCollection = function () {
    if (!$scope.productLoading) {
      $scope.formData.page = $scope.formData.page + 1;
      $scope.productLoading = true;
      Navigation.commonAPICall("User/getFavList", $scope.formData, function (data) {
        $scope.productLoading = false;
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
          $scope.$broadcast('scroll.infiniteScrollComplete');
        } else {
          console.log("out of API");
        }
        console.log($scope.favListChunk);
      });
    }
  }

  $scope.getCollection();
  $scope.onInfinite = function () {
    // console.log('Infinite');
    $scope.getCollection();

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
});
