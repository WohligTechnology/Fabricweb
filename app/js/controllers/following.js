myApp.controller("FollowingCtrl", function ($scope, $state, Navigation, $ionicPopup, $timeout) {

  Navigation.commonAPIWithoutLoader("User/getFollowingList", {
    user: $.jStorage.get('userInfo')._id,
    page: 1
  }, function (data) {
    if (data.data.value) {
      // console.log("FOllowers List::", data);
      $scope.followersList = data.data.data.followingUser;
      $scope.followChunk = _.chunk($scope.followersList, 2);
    }
  });

  Navigation.commonAPIWithoutLoader("User/getCategoryAndSubCategoryBuyer", {
    user: $.jStorage.get('userInfo')._id
  }, function (data) {
    if (data.data.value) {
      $scope.blockedUser = data.data.data.blockedUser;
      console.log("Blockedusers:::", $scope.blockedUser);
    }
  });

  $scope.goToSellerShop = function (sellerId) {
    $scope.block = _.cloneDeep($scope.blockedUser);
    var blockUser = _.remove($scope.block, function (m) {
      return m == sellerId
    })
    if (blockUser[0] == sellerId) {
      var alertPopup = $ionicPopup.show({
        title: "Blocked",
        template: "You Have Been Blocked",
        cssClass: "logoutPopup"
      });
      $timeout(function () {
        alertPopup.close();
      }, 1000);
      // ionicToast.show("You Have been Blocked by this seller", 'middle');
    } else {
      $state.go("sellermyshop", {
        sellerId: sellerId
      });
    }
  }

  $scope.goBackHandler = function () {
    Navigation.gobackHandler(); //This works
  };

  $scope.listDisplay = true;
  $scope.gridDisplay = false;

  $scope.changeDisplay = function () {
    $scope.listDisplay = !$scope.listDisplay;
    $scope.gridDisplay = !$scope.gridDisplay;
  }
});
