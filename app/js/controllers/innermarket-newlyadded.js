myApp.controller("innerMarketNewlyAddedCtrl", function (
  $scope,
  $stateParams,
  Navigation
) {
  $scope.goBackHandler = function () {
    Navigation.gobackHandler(); //This works
  };
  $scope.userId = $.jStorage.get("UserId");

  if ($scope.userId) {
    Navigation.commonAPICall(
      "User/getCategoryAndSubCategoryBuyer", {
        user: $scope.userId
      },
      function (data) {
        if (data.data.value) {
          $scope.filterCategory = [];
          $scope.user = data.data.data;
          var categ = _.cloneDeep($scope.user.category);
          $scope.catName = _.remove(categ, function (m) {
            if (m._id == $stateParams.categoryId) {
              return m.name;
            }
          });
          var subCat = _.cloneDeep($scope.user.subCategory);
          var subcategory = _.remove(subCat, function (m) {
            if (m.category._id == $stateParams.categoryId) {
              return m._id
            }
          })
          if (_.isEmpty(subcategory)) {
            $scope.formData.subCategory = "";
          } else {
            $scope.formData.subCategory = _.map(subcategory, '_id');
          }
          $scope.formData.blockedUser = $scope.user.blockedUser;
          getProducts();
          $scope.onInfinite = function () {
            getProducts();
          }
        }
      })
  }

  // if ($stateParams.categoryId) {
  $scope.sellerProducts = [];
  var getProducts = function () {
    if (!$scope.productLoading) {
      $scope.formData.page = $scope.formData.page + 1;
      $scope.productLoading = true;
      Navigation.commonAPICall(
        "product/getProductForSearch",
        $scope.formData,
        function (products) {
          $scope.productLoading = false;
          if (products.data.value) {
            if (_.isEmpty(products.data.data)) {
              $scope.productsLoaded = true;
            } else {
              $scope.sellerProducts = _.concat(
                $scope.sellerProducts,
                products.data.data
              );
              $scope.productChunk = _.chunk($scope.sellerProducts, 2);
              // $.jStorage.set("allProducts", {
              //   sellerProducts: $scope.sellerProducts,
              //   productChunk: $scope.productChunk,
              //   page: $scope.formData.page
              // });
              // $.jStorage.setTTL("allProducts", 50000);
            }
            $scope.$broadcast("scroll.infiniteScrollComplete");
          } else {
            console.log("out of API");
          }
        }
      );
    }
  };

  $scope.formData = {
    page: 0,
    category: $stateParams.categoryId,
    type: "category",
  };
});
