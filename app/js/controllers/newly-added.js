myApp.controller("newlyAddedCtrl", function (
  $scope,
  $ionicActionSheet,
  $state,
  Navigation
) {
  $scope.goBackHandler = function () {
    Navigation.gobackHandler(); //This works
  };

  /**To get the Newly Added products by sellers */
  $scope.currPage = 0;
  $scope.recentlyAdded = [];
  $scope.loadData = function () {
    if (!$scope.productLoading) {
      $scope.currPage = $scope.currPage + 1;
      $scope.productLoading = true;
      Navigation.commonAPICall("Product/recentlyAddedViewBuyer", {
        user: $.jStorage.get('userInfo')._id,
        page: $scope.currPage
      }, function (products) {
        if (products.data.value) {
          if (_.isEmpty(products.data.data)) {
            $scope.productsLoaded = true;
          } else {
            $scope.recentlyAdded = _.concat($scope.recentlyAdded, products.data.data);
            $scope.productChunk = _.chunk($scope.recentlyAdded,
              2
            );
          }
          $scope.$broadcast('scroll.infiniteScrollComplete');
        }
      });
    }
  }
  $scope.loadData();
  $scope.onInfinite = function () {
    $scope.loadData();
  }


  $scope.showActionsheet = function () {
    // Show the action sheet
    var hideSheet = $ionicActionSheet.show({
      buttons: [{
          text: "Favourite"
        },
        {
          text: " Interested"
        }
      ],
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
