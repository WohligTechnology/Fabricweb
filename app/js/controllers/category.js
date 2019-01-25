myApp.controller("CategoryCtrl", function (
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
  /**
   * Start By Checking $stateParams.id
   * */
  if (_.isEmpty($stateParams.id) || $stateParams.id == undefined) {
    $stateParams.id = $.jStorage.get("UserId");
  }
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
    branch: "Textile"
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
   * On Click On Category
   * */
  $scope.selectCategory = function (category) {
    $scope.checkCategoryInUser(category);
  };

  /**
   * To Check If Category Exists in User and Push and Pop
   * */
  $scope.checkCategoryInUser = function (category) {
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
      _.each($scope.category, function (n) {
        n.active = false;
        _.each($scope.user.category, function (m) {
          if (m._id.toString() == n._id.toString()) {
            n.active = true;
          }
        });
      });
      // $scope.checkActive();
    } else {
      $scope.user.category.push(category);
      _.each($scope.category, function (n) {
        n.active = false;
        _.each($scope.user.category, function (m) {
          if (m._id.toString() == n._id.toString()) {
            n.active = true;
          }
        });
      });
      // $scope.checkActive();
    }
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
    $scope.categoryChunk = _.chunk(
      _.orderBy($scope.category, ["createdAt"], ["desc"]),
      3
    );
  };

  /**
   * go To Next State
   * */
  $scope.goTo = function () {
    if ($scope.user.category.length != 0) {
      if ($stateParams.firstVisit) {
        $scope.user.registrationStatus = 'category';
        $scope.user.checkExpiry = false;
      }
      Navigation.commonAPICall("User/save", $scope.user, function (data) {
        if (data.data.value) {
          $state.go("inner-category", {
            id: $stateParams.id,
            firstVisit: true
          });
        } else {
          ionicToast.show("Please Submit Again", 'middle');
        }
      });
    } else {
      ionicToast.show("Please Select Atleast One", 'middle');
    }
  };
  $scope.goToShop = function () {
    $state.go("tab.myshop");

  };
  $scope.goBackHandler = function () {
    Navigation.gobackHandler();
  };
});
