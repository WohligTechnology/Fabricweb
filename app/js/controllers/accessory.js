myApp.controller("AccessoryCtrl", function (
  $scope,
  $stateParams,
  Navigation,
  $state,
  ionicToast,
  $ionicActionSheet,
  $cordovaCamera,
  $cordovaFileTransfer,
  $cordovaImagePicker
) {
  $scope.firstVisit = $stateParams.firstVisit;

  if (_.isEmpty($stateParams.id) || $stateParams.id == undefined) {
    $stateParams.id = $.jStorage.get("UserId");
  }
  /**
   * Start By Checking $stateParams.id
   * */
  if ($stateParams.id) {
    Navigation.commonAPICall(
      "User/getOne", {
        _id: $stateParams.id
      },
      function (data) {
        if (data.data.value) {
          $scope.user = data.data.data;
          $scope.loadData();
        }
      }
    );
  } else {
    ionicToast.show("No User Selected Please Try Again", 'middle');
  }

  /**
   * First API After StateParam
   * */
  var data = {
    branch: "Accessory"
  };
  $scope.loadData = function () {
    Navigation.commonAPICall("Category/getCategoriesByParams", data, function (
      data
    ) {
      if (data.data.value) {
        $scope.category = data.data.data;
        $scope.checkActive();
      } else {
        ionicToast.show("Please Reload Again", 'middle');
      }
    });
  };
  /**
   * Set and Unset Tick On Category
   * */
  $scope.checkActive = function () {
    _.each($scope.category, function (n) {
      n.active = false;
      _.each($scope.user.category, function (m) {
        if (m._id.toString() == n._id.toString()) {
          n.active = true;
        }
      });
    });
    $scope.categoryChunk = _.chunk($scope.category, 3);
  };
  /**
   * On Click On Category
   * */
  $scope.selectCategory = function (category) {
    console.log("HI Here", $scope.user.category);
    $scope.checkCategoryInUser(category);
  };

  /**
   * To Check If Category Exists in User and Push and Pop
   * */
  $scope.checkCategoryInUser = function (category) {
    // console.log("category", category);
    var exists = false;
    _.each($scope.user.category, function (n) {
      if (n._id.toString() == category._id.toString()) {
        exists = true;
      }
    });
    if (exists) {
      _.remove($scope.user.category, function (n) {
        return n._id.toString() == category._id.toString();
      });
      $scope.checkActive();
    } else {
      $scope.user.category.push(category);
      $scope.checkActive();
    }
  };

  /**
   * go To Next State
   * */
  $scope.goTo = function () {
    if ($stateParams.firstVisit) {
      $scope.user.registrationStatus = 'accessory';
      $scope.user.checkExpiry = false;
    }
    Navigation.commonAPICall("User/save", $scope.user, function (data) {
      if (data.data.value) {
        $state.go("tab.myshop");

      } else {
        ionicToast.show("Please Submit Again", 'middle');
      }
    });
  };
});
