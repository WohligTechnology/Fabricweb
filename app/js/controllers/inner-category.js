myApp.controller("InnerCategoryCtrl", function (
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
  $scope.categories = [];
  if ($stateParams.id) {
    Navigation.commonAPICall(
      "User/getOne", {
        _id: $stateParams.id
      },
      function (data) {
        if (data.data.value) {
          $scope.user = data.data.data;
          $scope.categories = $scope.user.category;
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
  $scope.loadData = function () {
    Navigation.commonAPICall("SubCategory/getAllSubCategories", {}, function (
      data
    ) {
      if (data.data.value) {
        $scope.subCategories = data.data.data;
        $scope.checkActive();
      } else {
        ionicToast.show("Please Reload Again", 'middle');
      }
    });
  };

  /**
   *
   * */
  $scope.checkActive = function () {
    _.each($scope.categories, function (n) {
      n.subCategories = [];
      n.activeCount = 0;
      _.each($scope.subCategories, function (m) {
        if (n._id.toString() == m.category._id.toString()) {
          m.active = false;
          _.each($scope.user.subCategory, function (o) {
            if (o._id.toString() == m._id.toString()) {
              m.active = true;
              n.activeCount += 1;
            }
          });
          n.subCategories.push(m);
        }
      });
      n.subCategoriesChunk = _.chunk(n.subCategories, 3);
    });
  };
  /**
   *
   * */
  $scope.checkSubCategoryInUser = function (subCategory) {
    var exists = false;
    _.each($scope.user.subCategory, function (n) {
      if (n._id.toString() == subCategory._id.toString()) {
        exists = true;
      }
    });
    if (exists) {
      _.remove($scope.user.subCategory, function (n) {
        return n._id.toString() == subCategory._id.toString();
      });
      _.each($scope.categories, function (n) {
        n.subCategories = [];
        n.activeCount = 0;
        _.each($scope.subCategories, function (m) {
          if (n._id.toString() == m.category._id.toString()) {
            m.active = false;
            _.each($scope.user.subCategory, function (o) {
              if (o._id.toString() == m._id.toString()) {
                m.active = true;
                n.activeCount += 1;
              }
            });
            n.subCategories.push(m);
          }
        });
        // n.subCategoriesChunk = _.chunk(n.subCategories, 3);
      });
      // $scope.checkActive();
    } else {
      $scope.user.subCategory.push(subCategory);
      _.each($scope.categories, function (n) {
        n.subCategories = [];
        n.activeCount = 0;
        _.each($scope.subCategories, function (m) {
          if (n._id.toString() == m.category._id.toString()) {
            m.active = false;
            _.each($scope.user.subCategory, function (o) {
              if (o._id.toString() == m._id.toString()) {
                m.active = true;
                n.activeCount += 1;
              }
            });
            n.subCategories.push(m);
          }
        });
        // n.subCategoriesChunk = _.chunk(n.subCategories, 3);
      });
      // $scope.checkActive();
    }
  };
  /**
   *
   * */
  $scope.selectCategory = function (data) {
    console.log("Data");
  };
  /**
   *
   * */
  $scope.toggleGroup = function (group) {
    if ($scope.isGroupShown(group)) {
      $scope.shownGroup = null;
    } else {
      $scope.shownGroup = group;
    }
  };
  /**
   *
   * */
  $scope.isGroupShown = function (group) {
    return $scope.shownGroup === group;
  };
  $scope.goToCategories = function () {
    $state.go("category", {
      id: $state.params.id
    });
  };
  $scope.goBackHandler = function () {
    Navigation.gobackHandler();
  };
  /**
   *
   * */
  $scope.goBuyerSeller = function () {
    var atleastoneselected = true;
    _.each($scope.categories, function (n) {
      if (n.activeCount == 0) {
        atleastoneselected = false;
      }
    });
    console.log("In Here");
    if (atleastoneselected) {
      if ($stateParams.firstVisit) {
        $scope.user.registrationStatus = 'subCategory';
        $scope.user.checkExpiry = false;
      }
      Navigation.commonAPICall("User/save", $scope.user, function (data) {
        if (data.data.value) {
          console.log("data", data);
          $state.go("tab.myshop");
        } else {
          ionicToast.show("Please Submit Again", 'middle');
        }
      });
    } else {
      ionicToast.show("Please Select Atleast One From Each", 'middle');
    }
  };
});
