myApp.controller("InnerMarketCtrl", function (
  $scope,
  $stateParams,
  Navigation,
  $state,
  $ionicModal,
  ionicToast,
  $ionicActionSheet,
  $window,
  $rootScope,
  $timeout,
  $ionicScrollDelegate
) {
  $scope.filterData = {};
  var dataFetcher = null;
  var mySocket = io.sails.connect(adminSocket);
  mySocket.on("newProduct", function onConnect(data) {
    var found = -1;
    if (!_.isEmpty($scope.user) && !_.isEmpty($scope.user.blockedUser)) {
      found = _.findIndex($scope.user.blockedUser, function (block) {
        return block === data.owner._id;
      });
    }
    if (
      found == -1 &&
      $state.current.name == "tab.market" &&
      ($scope.selectedCategory == "All" ||
        $scope.selectedCategory === data.subCategory._id)
    ) {
      $scope.sellerProducts.unshift(data);
      $scope.productChunk = _.chunk($scope.sellerProducts, 2);
      $scope.$apply();
    }
  });
  /**
   * Start By Checking $stateParams.id
   * */
  var userSubcategory;
  $scope.buyermyShopPage = true;
  if (_.isEmpty($stateParams.id) || $stateParams.id == undefined) {
    $stateParams.id = $.jStorage.get("UserId");
  }
  var count = 0;
  var init = function () {
    if ($stateParams.id) {
      Navigation.commonAPICall(
        "User/getCategoryAndSubCategoryBuyer", {
          user: $stateParams.id
        },
        function (data) {
          if (data.data.value) {
            $scope.filterCategory = [];
            $scope.user = data.data.data;
            $scope.formData.blockedUser = $scope.user.blockedUser;
            $scope.subCategoryArray = _.map($scope.user.subCategory, function (
              m
            ) {
              return m._id;
            });
            $scope.allCatChunk = _.chunk($scope.user.category, 3);
            var allCat = _.cloneDeep($scope.user.category);
            var accessory = _.remove(allCat, function (cat) {
              return cat.branch == "Accessory";
            });
            $scope.filterCategory = [];
            if (accessory.length > 0) {
              $scope.filterCategory.push({
                name: "Accessory"
              });
            }
            $scope.filterCategory = _.concat(
              $scope.filterCategory,
              _.map(allCat, function (cat) {
                return {
                  _id: cat._id,
                  name: cat.name
                };
              })
            );
            userSubcategory = [{
              name: "All",
              image: "img/products/checks.jpeg",
              _id: "All"
            }];
            if (accessory.length > 0) {
              userSubcategory = _.concat(userSubcategory, accessory);
            }
            userSubcategory = _.concat(
              userSubcategory,
              data.data.data.subCategory
            );
            if ($(window).width() > 480) {
              $scope.subCategoryChunk = _.chunk(userSubcategory, 4);
              $scope.subCategoryclass = "col-25"
            } else {
              $scope.subCategoryChunk = _.chunk(userSubcategory, 3);
              $scope.subCategoryclass = 'col-33';
            }
            $scope.formData.subCategory = $scope.subCategoryArray;
            $scope.formData.type = "All";
            getProducts();
            $scope.allowLoadMore = true;
          }
        }
      );
    } else {
      ionicToast.show("No User Selected Please Try Again", "middle");
    }
  };
  init();
  $scope.onInfinite = function () {
    if (!$scope.pullToRefreshWorking) {
      if (!!dataFetcher) dataFetcher.abort();
      if ($scope.allowLoadMore) {
        getProducts();
      }
    }
  };
  var subcategories;
  $scope.userSubCategoryData = [{
    name: "All",
    image: "img/products/checks.jpeg",
    _id: "All"
  }];

  $scope.selectedCategory = "All";

  $scope.selectCategories = function (selectedCategory) {
    $scope.productsLoaded = false;
    $scope.selectedCategory = selectedCategory;
  };

  var currpage = 0;
  $scope.sellerProducts = [];
  /**
   * Common function To get all products and products as per category and subCategory
   */
  function getProducts() {
    if (!$scope.productsLoading) {
      $scope.formData.page = $scope.formData.page + 1;
      $scope.productsLoading = true;
      Navigation.commonAPICall(
        "product/getProductForSearch",
        $scope.formData,
        function (products) {
          $timeout(function () {
            $scope.pullToRefreshWorking = false;
          }, 5000);
          if ($scope.isRefreshing) {
            $scope.$broadcast('scroll.refreshComplete');
            $scope.isRefreshing = false;
          }
          $scope.productsLoading = false;
          if (products.data.value) {
            if (_.isEmpty(products.data.data)) {
              $scope.productsLoaded = true;
            } else {
              $scope.sellerProducts = _.concat(
                $scope.sellerProducts,
                products.data.data
              );
              $scope.productChunk = _.chunk($scope.sellerProducts, 2);
            }
          } else {
            console.log("out of API");
          }
          $scope.$broadcast("scroll.infiniteScrollComplete");
          $timeout(function () {
            $ionicScrollDelegate.$getByHandle('mainScroll').resize();
          }, 5000);
        }
      );
    }
  };

  $scope.formData = {
    page: 0,
    category: "",
    subCategory: ""
  };

  /**TO get products as pere subcategory and category */
  $scope.getProductsOnFilter = function (category, subcategory) {
    $scope.productChunk = [];
    $scope.sellerProducts = [];
    $scope.formData.page = 0;
    if ($scope.selectedCategory == "All") {
      $scope.formData.type = "All";
      $scope.formData.category = "";
      $scope.formData.subCategory = $scope.subCategoryArray;
    } else {
      delete $scope.formData.type;
      $scope.formData.category = category;
      $scope.formData.subCategory = subcategory;
    }
    getProducts();
  };

  $scope.postReqData = {};
  $scope.sendPostRequirement = function () {
    ($scope.postReqData.branch = "PostRequirment"),
    ($scope.postReqData.owner = $.jStorage.get("userInfo")._id),
    // $scope.postReqData.name = "product",
    ($scope.postRequirementPromise = Navigation.commonAPICall(
      "Product/postYourRequirment", {
        product: $scope.postReqData,
        buyer: $.jStorage.get("userInfo")._id
      },
      function (data) {
        if (data.data.value) {
          $scope.postReqData = {};
          ionicToast.show("Requirement sent", "middle");
        }
      }
    ));
  };

  $ionicModal
    .fromTemplateUrl("templates/modal/post-your-req-modal.html", {
      scope: $scope
    })
    .then(function (modal) {
      $scope.PostReqModal = modal;
    });
  $scope.openPostReqModal = function () {
    $scope.postReqData = {};
    $scope.PostReqModal.show();
  };

  $scope.closePostReqModal = function () {
    $scope.PostReqModal.hide();
  };

  $scope.addCamera = function (index, maxImage) {
    Navigation.showActionsheet(false, index, maxImage, function (Images) {
      if (!$scope.postReqData.images) {
        $scope.postReqData.images = [];
      }
      _.forEach(Images, function (value) {
        $scope.postReqData.images.push(value);
      });
      $scope.postReqData.imageChunk = _.chunk($scope.postReqData.images, 3);
    });
  };

  $scope.removeImage = function (outerIndex, innerIndex) {
    var index = 3 * outerIndex + innerIndex;
    _.pullAt($scope.formData.images, index);
    $scope.imageChunk = _.chunk($scope.formData.images, 3);
  };

  $scope.removeImagePostReq = function (outerIndex, innerIndex) {
    var index = 3 * outerIndex + innerIndex;
    _.pullAt($scope.postReqData.images, index);
    $scope.postReqData.imageChunk = _.chunk($scope.postReqData.images, 3);
  };

  // sorting modal
  $ionicModal
    .fromTemplateUrl("templates/modal/sort-product-modal.html", {
      scope: $scope,
      animation: "slide-left-right"
    })
    .then(function (modal) {
      $scope.sortProductModal = modal;
    });
  $scope.openSortProductModal = function () {
    $scope.oldFormData = _.cloneDeep($scope.formData);
    $scope.oldFilterObj = _.cloneDeep($scope.filterObj);
    $scope.sortProductModal.show();
  };

  $scope.closeSortProductModal = function () {
    $scope.sortProductModal.hide();
  };
  $scope.crossFilter = function () {
    if (!$scope.clearFilter) {
      $scope.formData = $scope.oldFormData;
      $scope.filterObj = $scope.oldFilterObj;
    } else {
      $scope.clearFilter = true;
    }
  };
  /**Filter start */
  $scope.filterObj = {
    minPrice: 0,
    maxPrice: 0
  };

  Navigation.commonAPICall("Category/search", {}, function (data) {
    $scope.allCategory = data.data.data.results;
  });
  $scope.getSubCategory = function (cat) {
    var data = {};
    $scope.filterObj.category = cat;
    $scope.subCategories = [];
    if ($scope.filterObj.category.name != "Accessory") {
      _.each($scope.user.subCategory, function (sub) {
        if (
          sub.category._id.toString() ==
          $scope.filterObj.category._id.toString()
        ) {
          $scope.subCategories.push(sub);
        }
      });
    }
    if ($scope.filterObj.category.name == "Accessory") {
      _.each($scope.user.category, function (m) {
        if (m.branch == "Accessory") {
          $scope.subCategories.push(m);
        }
      });
    }
  };

  Navigation.commonAPICall("User/getCity", {}, function (data) {
    $scope.city = data.data.data;
  });

  $scope.applyFilter = function () {
    $scope.productChunk = [];
    $scope.sellerProducts = [];
    var reqData = _.cloneDeep($scope.filterObj);
    if (reqData.category) {
      reqData.category = reqData.category._id;
    }
    if (reqData.subCategory) {
      if (reqData.subCategory.branch == "Accessory") {
        reqData.category = reqData.subCategory._id;
        reqData.subCategory = "";
      } else {
        reqData.subCategory = reqData.subCategory._id;
      }
    }
    if (reqData.maxPrice == 0) {
      delete reqData.minPrice;
      delete reqData.maxPrice;
    }
    reqData.page = 0;
    reqData.blockedUser = $scope.user.blockedUser;
    $scope.formData = _.cloneDeep(reqData);
    getProducts();
  };
  $scope.clearFilter = false;

  $scope.clearAllFilter = function () {
    $scope.filterObj = {
      minPrice: 0,
      maxPrice: 0
    };
    $scope.filterApplied = false;
    $scope.clearFilter = true;
    var reqData = _.cloneDeep($scope.filterObj);
    reqData.page = 0;
    reqData.blockedUser = $scope.user.blockedUser;
    $scope.formData = _.cloneDeep(reqData);
    $scope.productChunk = [];
    $scope.sellerProducts = [];
    getProducts();

  };

  Navigation.commonAPICall("Product/getMinAndMax", {}, function (data) {
    var min1 = data.data.data.min;
    var max1 = data.data.data.max;
    $scope.slider = {
      options: {
        floor: min1,
        ceil: max1
      }
    };
  });

  /**Filter End */

  /**search header start*/
  $scope.searchProduct = function (search) {
    if (!_.isEmpty(search)) {
      $state.go("buyer-searched-products", {
        keyword: search
      });
    }
  };
  /**search end */
  $rootScope.$on("$stateChangeSuccess", function (
    event,
    toState,
    toParams,
    fromState,
    fromParams
  ) {
    if (fromState.name == "buyer-inner-category") {
      $scope.productChunk = [];
      $scope.sellerProducts = [];
      $scope.formData.page = 0;
    }
    if (toState.name == "tab.market" && fromState.name != "buyer-product-detail") {
      init();
    }
  });
  $scope.uploadedimg = function (data) {

    if (!$scope.postReqData.images) {
      $scope.postReqData.images = [];
    }
    _.forEach(data, function (value) {
      $scope.postReqData.images.push(value);
    });
    $scope.postReqData.imageChunk = _.chunk($scope.postReqData.images, 3);
  }
  $scope.scrollToTop = function () {
    $scope.pullToRefreshWorking = true;
    $timeout(function () {
      $scope.productChunk = [];
      $scope.sellerProducts = [];
      $scope.formData.page = 0;
      $scope.productsLoaded = false;
      $scope.productsLoading = false;
      $scope.isRefreshing = true;
      if (!!dataFetcher) dataFetcher.abort();
      getProducts();
    }, 500);
  }
});
