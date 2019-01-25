myApp.controller("InnerShopCtrl", function (
  $scope,
  $ionicModal,
  $ionicActionSheet,
  $stateParams,
  Navigation,
  ionicToast,
  $ionicPopup,
  $state
) {
  $scope.innerShop = true;
  $scope.goBackHandler = function () {
    Navigation.gobackHandler();
  };
  $ionicModal
    .fromTemplateUrl("templates/modal/sort-product-modal.html", {
      scope: $scope,
      animation: "slide-left-right"
    })
    .then(function (modal) {
      $scope.sortProductModal = modal;
    });
  if ($.jStorage.get("userInfo")._id) {
    Navigation.commonAPICall(
      "User/getOne", {
        _id: $.jStorage.get("userInfo")._id
      },
      function (data) {
        if (data.data.value) {
          $scope.user = data.data.data;
          if ($stateParams.category) {
            _.each($scope.user.category, function (n) {
              if (n._id.toString() == $stateParams.category.toString()) {
                $scope.name = n.name;
              }
            });
          } else {
            _.each($scope.user.subCategory, function (n) {
              if (n._id.toString() == $stateParams.subCategory.toString()) {
                $scope.name = n.name;
              }
            });
          }
          $scope.getProducts();
        }
      }
    );
  } else {
    ionicToast.show("No User Selected Please Try Again", 'middle');
  }
  $scope.applyFilter = function () {
    $scope.getProducts()
  }
  $scope.formData = {};
  // $scope.formData.days = "30";
  $scope.getProducts = function () {
    console.log("$scope.days", $scope.formData.days);
    var obj = {};
    obj.owner = $.jStorage.get("userInfo")._id;
    if ($stateParams.subCategory) {
      obj.subCategory = $stateParams.subCategory;
    }
    if ($stateParams.category) {
      obj.category = $stateParams.category;
    }
    if ($scope.formData.days) {
      obj.days = $scope.formData.days;
    }
    Navigation.commonAPICall("Product/getProductsWithLimit", obj, function (
      data
    ) {
      $scope.productsChunk = _.chunk(data.data.data, 2);
      $scope.sortProductModal ? $scope.closeSortProductModal() : '';
    });
  };
  $scope.openSortProductModal = function () {
    $scope.sortProductModal.show();
  };

  $scope.closeSortProductModal = function () {
    $scope.sortProductModal.hide();
  };

  $scope.searchProduct = function (search) {
    Navigation.commonAPICall(
      "product/getProductForSearch", {
        owner: $.jStorage.get("UserId"),
        name: search
      },
      function (data) {
        if (data.data.value) {
          $scope.searchProducts = data.data.data;
        }
      }
    );
  };
  $scope.searchProductInner = function (search) {
    if (!_.isEmpty(search)) {
      $state.go("searched-products", {
        keyword: search
      });
    }
  }
  $scope.showActionsheet = function (product) {
    // Show the action sheet
    var hideSheet = $ionicActionSheet.show({
      buttons: [{
          text: " Edit"
        },
        {
          text: " Delete"
        }
      ],
      // destructiveText: "Delete",
      cancelText: "Cancel",
      cancel: function () {
        // add cancel code..
      },
      buttonClicked: function (index) {
        if (index == 0) {
          console.log("Index", index, product);
          $state.go("edit-product", {
            id: $.jStorage.get("userInfo")._id,
            product: product._id
          });
        } else {

          var confirmPopup = $ionicPopup.confirm({
            template: 'Do you permanently want to delete this product?',
            buttons: [{
              text: '<b>Yes</b>',
              type: 'button-balanced',
              onTap: function (e) {
                //don't allow the user to close unless he enters model...
                Navigation.commonAPICall(
                  "Product/delete", {
                    _id: product._id
                  },
                  function (data) {
                    var obj = {};
                    obj.id = $.jStorage.get("userInfo")._id;
                    if ($stateParams.subCategory) {
                      obj.subCategory = $stateParams.subCategory;
                    }
                    if ($stateParams.category) {
                      obj.category = $stateParams.category;
                    }
                    // $state.go("app.sellertab", {
                    //   tab: "myshop"
                    // });
                    $scope.getProducts();
                  }
                );
              }
            }, {
              text: 'No',
              type: 'button-assertive',
            }]
          });

          confirmPopup.then(function (res) {
            if (res) {
              console.log('Sure!');
              Navigation.commonAPICall(
                "Product/delete", {
                  _id: product._id
                },
                function (data) {
                  var obj = {};
                  obj.id = $.jStorage.get("userInfo")._id;
                  if ($stateParams.subCategory) {
                    obj.subCategory = $stateParams.subCategory;
                  }
                  if ($stateParams.category) {
                    obj.category = $stateParams.category;
                  }
                  $state.go("tab.myshop");

                }
              );
            } else {
              console.log('Not sure!');
            }
          });

        }
        return true;
      }
    });
  };
  $scope.goToProductDetail = function (productId) {
    console.log("goToProductDetail");
    $state.go("product-detail", {
      id: $.jStorage.get("userInfo")._id,
      productId: productId
    });
  };
});
