myApp.controller("SellerBuyerCtrl", function (
  $scope,
  $rootScope,
  Navigation,
  $state,
  $stateParams,
  ionicToast
) {
  $scope.seller = {
    active: false
  };
  $scope.buyer = {
    active: false
  };
  submenu = true;
  var user = {};
  user._id = $stateParams.id ? $stateParams.id : $.jStorage.get("UserId");
  user.isSeller = false;
  user.isBuyer = false;
  user.isAccessories = false;
  user.isTextile = false;
  $scope.selectSellerBuyer = function (buyerSeller) {
    if (buyerSeller == "Buyer") {
      delete $scope.selectedsupplier;
      user.isSeller = false;
      user.isBuyer = true;
      user.isAccessories = false;
      user.isTextile = false;
      $scope.buyer.active = !$scope.buyer.active;
      $scope.seller.active = false;
      if ($scope.buyer.active) {
        $.jStorage.set("type", buyerSeller);
        $scope.type = $.jStorage.get("type");
        console.log($scope.type);
      }
    } else {
      user.isSeller = true;
      user.isBuyer = false;
      $scope.buyer.active = false;
      $scope.seller.active = !$scope.seller.active;
      if ($scope.seller.active) {
        $.jStorage.set("type", buyerSeller);
        $scope.type = $.jStorage.get("type");
        console.log($scope.type);
      }
    }
  };
  $scope.supplier = function (suppliers) {
    $scope.selectedsupplier = suppliers;
    if ($scope.selectedsupplier == "accessories") {
      user.isAccessories = true;
      user.isTextile = false;
    } else {
      user.isTextile = true;
      user.isAccessories = false;
    }
  };
  $scope.nextPage = function () {
    console.log("user", user);
    user.checkExpiry = false;
    user.registrationStatus = 'userType';
    Navigation.commonAPIWithoutLoader("User/save", user, function (data, buyerSeller) {
      if (data.data.value) {
        $state.go("add-information", {
          id: $stateParams.id ? $stateParams.id : $.jStorage.get("UserId"),
          type: $.jStorage.get("type")
        });
      } else {
        ionicToast.show("User Not Available", 'middle');
      }
    });
  };
});
