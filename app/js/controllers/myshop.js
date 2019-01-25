myApp.controller("MyShopCtrl", function (
  $scope,
  $ionicModal,
  $stateParams,
  Navigation,
  ionicToast,
  $state,
  $rootScope
) {
  $scope.myShopPage = true;
  $scope.doRefresh = function () {
    $scope.getMyProduct();
  }
  if (_.isEmpty($stateParams.id) || $stateParams.id == undefined) {
    $stateParams.id = $.jStorage.get("UserId");
  }
  $ionicModal
    .fromTemplateUrl("templates/modal/sort-product-modal.html", {
      scope: $scope,
      animation: "slide-left-right",
    })
    .then(function (modal) {
      console.log("modal", modal);
      $scope.sortProductModal = modal;
    });
  $scope.openSortProductModal = function () {
    if ($scope.user.isTextile) {
      _.each($scope.categories, function (n) {
        // n.filter = true;
        _.each(n.subCategory, function (m) {
          m.applyFilter = m.filter;
        });
        n.subCategoryChunk = _.chunk(n.subCategory, 2);
      });
      console.log($scope.categories);
      console.log("$scope.categories-->", $scope.categories);
    } else {
      _.each($scope.categories, function (n) {
        n.applyFilter = n.filter;
      });
      $scope.categoriesChunk = _.chunk($scope.categories, 2);
    }
    $scope.sortProductModal.show();
  };
  $scope.seletcedTab = {};
  $scope.catSelectFun = function (cat) {
    console.log("cat", cat);
    if (cat == 'Price') {
      $scope.seletcedTab = 'Price'
      console.log("$scope.seletcedTab", $scope.seletcedTab);
    }
    $scope.seletcedTab = cat;
  };
  $scope.getMyProduct = function () {
    if ($stateParams.id) {
      Navigation.commonAPICall(
        "User/getOne", {
          _id: $stateParams.id
        },
        function (data) {
          if (data.data.value) {
            var url = "User/getMyShopPageDetailsAccessories";
            if (data.data.data.isTextile) {
              url = "User/getMyShopPageDetails";
            }
            Navigation.commonAPICall(
              url, {
                _id: $stateParams.id
              },
              function (data) {
                $scope.$broadcast('scroll.refreshComplete');
                if (data.data.value) {
                  $scope.user = data.data.data;
                  console.log("$scope.user", $scope.user);
                  $scope.categories = $scope.user.categoryArr;
                  if ($scope.user.isTextile) {
                    _.each($scope.categories, function (n) {
                      // n.filter = true;
                      _.each(n.subCategory, function (m) {
                        m.filter = true;
                        m.applyFilter = true;
                      });
                      n.subCategoryChunk = _.chunk(n.subCategory, 2);
                    });
                    console.log($scope.categories);
                    console.log("$scope.categories-->", $scope.categories);
                  } else {
                    _.each($scope.categories, function (n) {
                      n.filter = true;
                      n.applyFilter = true;
                    });
                    $scope.categoriesChunk = _.chunk($scope.categories, 2);
                  }
                  $scope.seletcedTab = $scope.categories[0];
                }
              }
            );
          }
        }
      );
    } else {
      ionicToast.show("No User Selected Please Try Again", 'middle');
    }
  }
  $scope.getMyProduct();
  $scope.closeSortProductModal = function () {
    $scope.sortProductModal.hide();
  };

  $scope.clearAllFilter = function () {
    if ($scope.user.isTextile) {
      _.each($scope.categories, function (n) {
        // n.filter = true;
        _.each(n.subCategory, function (m) {
          // m.filter = false;
          m.applyFilter = false;
        });
        n.subCategoryChunk = _.chunk(n.subCategory, 2);
      });
      console.log($scope.categories);
      console.log("$scope.categories-->", $scope.categories);
    } else {
      _.each($scope.categories, function (n) {
        // n.filter = false;
        n.applyFilter = false;
      });
      $scope.categoriesChunk = _.chunk($scope.categories, 2);
    }
  }
  $scope.applyFilter = function () {
    if ($scope.user.isTextile) {
      _.each($scope.categories, function (n) {
        // n.filter = true;
        _.each(n.subCategory, function (m) {
          m.filter = m.applyFilter;
        });
        n.subCategoryChunk = _.chunk(n.subCategory, 2);
      });
      console.log($scope.categories);
      console.log("$scope.categories-->", $scope.categories);
    } else {
      _.each($scope.categories, function (n) {
        n.filter = n.applyFilter;
      });
      $scope.categoriesChunk = _.chunk($scope.categories, 2);
    }
    $scope.closeSortProductModal();
  }

  $scope.searchProduct = function (search) {
    if (!_.isEmpty(search)) {
      $state.go("searched-products", {
        keyword: search
      });
    }
    // Navigation.commonAPICall(
    //   "product/getProductForSearch",
    //   {
    //     owner: $.jStorage.get("UserId"),
    //     name: search
    //   },
    //   function(data) {
    //     if (data.data.value) {
    //       $scope.searchProducts = data.data.data;
    //     }
    //   }
    // );
  };
  $scope.goToProductDetail = function (productId) {
    console.log("goToProductDetail");
    $state.go("product-detail", {
      id: $stateParams.id,
      productId: productId
    });
  };
  $scope.addNewProduct = function (category, subCategory) {
    var obj = {
      id: $stateParams.id
    };
    if (category) {
      obj.category = category;
    }
    if (subCategory) {
      obj.subCategory = subCategory;
    }
    $state.go("add-new-product", obj);
  };
  $scope.goToInnerPageOfShop = function (subCategory) {
    console.log("subCategory", subCategory);
    $state.go("inner-shop", {
      subCategory: subCategory._id,
    });
  };
  $scope.goToInnerPageOfShopAccess = function (category) {
    console.log("category", category);
    $state.go("inner-shop", {
      category: category._id,
    });
  };
  $rootScope.$on("$stateChangeSuccess", function (
    event,
    toState,
    toParams,
    fromState,
    fromParams
  ) {
    if (toState.name == 'tab.myshop') {
      $scope.getMyProduct();
      $scope.applyFilter();
    }
  });
});
