myApp.controller("RecentlyviewCtrl", function (
  $scope,
  $ionicActionSheet,
  $state,
  Navigation
) {
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
  $scope.userId = $.jStorage.get("UserId");
  var page = 0;
  $scope.recentProducts = [];
  var recentProducts1 = [];
  var getRecentProducts = function () {
    if (!$scope.productLoading) {
      $scope.productLoading = true;
      page += 1;
      Navigation.commonAPICall("user/getRecentlyViewed", {
        user: $.jStorage.get("UserId"),
        page: page
      }, function (products) {
        $scope.productLoading = false;
        if (products.data.value) {
          if (_.isEmpty(products.data.data.recentlyViewed)) {
            $scope.productsLoaded = true;
          } else {
            recentProducts1 = _.concat(recentProducts1, products.data.data.recentlyViewed);
            $scope.recentProducts = _.chunk(recentProducts1, 2);
          }
          $scope.$broadcast('scroll.infiniteScrollComplete');
        }
      });
    }
  }
  $scope.loadMore = function () {
    // console.log('Infinite');
    getRecentProducts()
  }
});
