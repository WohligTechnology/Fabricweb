myApp.controller("BuyerInnerCategoryCtrl", function (
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
  $scope.accessoryCount = 0;
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
        console.log("ABC")
        $scope.subCategories = data.data.data;
        // console.log("$scope.subCategories", $scope.subCategories);
        $scope.checkActive();
      } else {
        ionicToast.show("Please Reload Again", 'middle');
      }
    });
    var dataAcc = {
      branch: "Accessory"
    };
    Navigation.commonAPICall("Category/getCategoriesByParams", dataAcc, function (
      data
    ) {
      if (data.data.value) {
        $scope.accessoriesCategory = data.data.data;
        // console.log("Accessories::", $scope.category);
        $scope.checkActiveAccessories();
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
      // console.log("$scope.subCategories", $scope.subCategories);
      _.each($scope.subCategories, function (m) {
        // console.log("m.category", m.category)
        if (n._id.toString() == m.category._id.toString()) {
          m.active = false;
          _.each($scope.user.subCategory, function (o) {
            if (o._id.toString() == m._id.toString()) {
              m.active = true;
              o.active = true;
              n.activeCount += 1;
            }
          });
          n.subCategories.push(m);
        }
      });
      if ($(window).width() > 480) {
        n.subCategoriesChunk = _.chunk(n.subCategories, 4);
        $scope.subCategoryclass = "col-25"
      } else {
        n.subCategoriesChunk = _.chunk(n.subCategories, 3)
        $scope.subCategoryclass = 'col-33';
      }
      // n.subCategoriesChunk = _.chunk(n.subCategories, 3);
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
                o.active = true;
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
                o.active = true;
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
    $state.go("buyer-category", {
      id: $state.params.id
    });
  };

  /**For getting Accessories */
  $scope.checkActiveAccessories = function () {
    $scope.accessoryCount = 0;
    _.each($scope.accessoriesCategory, function (n) {
      n.active = false;
      _.each($scope.user.category, function (m) {
        if (m._id.toString() == n._id.toString()) {
          n.active = true;
          $scope.accessoryCount += 1;
        }
      });
    });
    $scope.accessoriesCategoryChunk = _.chunk($scope.accessoriesCategory, 3);
  };


  /**
   * On Click On Category
   * */
  $scope.selectAccessory = function (category) {
    $scope.checkCategoryInUser(category);
    console.log("HI Here", $scope.user.category);
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
      $scope.checkActiveAccessories();
    } else {
      $scope.user.category.push(category);
      $scope.checkActiveAccessories();
    }
  };

  /**
   * go To Next State
   * */
  // $scope.goTo = function () {
  //   Navigation.commonAPICall("User/save", $scope.user, function (data) {
  //     if (data.data.value) {
  //       $state.go("tab.myshop");

  //     } else {
  //       ionicToast.show("Please Submit Again", 'middle');
  //     }
  //   });
  // };

  /**Accessories End */


  $scope.goBackHandler = function () {
    Navigation.gobackHandler();
  };
  /**
   *
   * */
  $scope.goBuyerSeller = function () {
    var atleastoneselected = true;
    console.log("-->$scope.categories", $scope.categories)
    _.each($scope.categories, function (n) {
      if (n.activeCount == 0 && n.branch != "Accessory") {
        atleastoneselected = false;
      }
    });
    _.remove($scope.user.subCategory, function (subCat) {
      return !subCat.active;
    })
    if ($scope.user.isAccessories && $scope.accessoryCount == 0) {
      atleastoneselected = false;
    }
    console.log("In Here");
    if (atleastoneselected) {
      if ($stateParams.firstVisit) {
        $scope.user.registrationStatus = 'subCategory';
        $scope.user.checkExpiry = false;
      }
      Navigation.commonAPICall("User/save", $scope.user, function (data) {
        if (data.data.value) {
          // console.log("data", data);
          $state.go("tab.market");
        } else {
          ionicToast.show("Please Submit Again", 'middle');
        }
      });
    } else {
      ionicToast.show("Please Select Atleast One From Each", 'middle');
    }
  };
});
