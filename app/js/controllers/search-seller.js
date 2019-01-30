myApp.controller("SearchSellerCtrl", function (
  $scope,
  $ionicModal,
  Navigation,
  $state,
  $ionicPopup,
  $timeout,
  $rootScope,
  $ionicScrollDelegate
) {
  var dataFetcher = null;
  $scope.goBackHandler = function () {
    Navigation.gobackHandler(); //This works
  };

  Navigation.commonAPIWithoutLoader(
    "User/getOne", {
      _id: $.jStorage.get("userInfo")._id
    },
    function (data) {
      if (data.data.value) {
        $scope.user = data.data.data;
        $scope.blockedUser = $scope.user.blockedUser;
      }
    }
  );

  $scope.userSellers = [];
  $scope.getSellers = function (keyword, from) {
    if (!$scope.usersLoading) {
      $scope.page = $scope.page + 1;
      var reqData = {
        page: $scope.page,
        filter: {
          isSeller: true
        }
      };
      if (!_.isEmpty(keyword)) {
        $scope.keyword = keyword;
        reqData.filter.$or = [{
            name: {
              $regex: "" + $scope.keyword,
              $options: "im"
            }
          },
          {
            companyName: {
              $regex: "" + $scope.keyword,
              $options: "im"
            }
          }
        ];
      }
      if (from == "input") {
        reqData.page = 1;
        $scope.userSellers = [];
      }
      Navigation.commonAPICall("User/search", reqData, function (userData) {
        $timeout(function () {
          $scope.productsLoading = false;
        }, 3000);
        if ($scope.isRefreshing) {
          $scope.$broadcast('scroll.refreshComplete');
          $scope.isRefreshing = false;
        }
        $scope.usersLoading = false;
        if (userData.data.value) {
          if (_.isEmpty(userData.data.data.results)) {
            $scope.usersLoaded = true;
          } else {
            if (from == "input") {
              $scope.userSellers = [];
            }
            $scope.users = userData.data.data.results;
            _.each($scope.users, function (n) {
              if (n.isSeller) {
                $scope.userSellers = _.concat($scope.userSellers, n);
                $scope.userSellerChunk = _.chunk($scope.userSellers, 2);
              }
            });
          }
          $scope.$broadcast("scroll.infiniteScrollComplete");
          $timeout(function () {
            $ionicScrollDelegate.$getByHandle('mainScroll').resize();
          });
        } else {
          console.log("Some Error ");
        }
      });
    }
  };

  $scope.page = 0;
  $scope.getSellers($scope.keyword, "controller");
  $scope.onInfinite = function () {
    if (!$scope.productsLoading) {
      if (!!dataFetcher) dataFetcher.abort();
      $scope.getSellers($scope.keyword, "controller");
    }
  };

  $scope.getSellerProfile = function (sellerId) {
    $state.go("seller-profile", {
      sellerId: sellerId
    });
  };

  $scope.goToSellerShop = function (sellerId) {
    $scope.block = _.cloneDeep($scope.blockedUser);
    var blockedUser = _.remove($scope.block, function (m) {
      return m == sellerId;
    });
    if (blockedUser[0] == sellerId) {
      var alertPopup = $ionicPopup.show({
        title: "Blocked",
        template: "You Have Been Blocked",
        cssClass: "logoutPopup"
      });
      $timeout(function () {
        alertPopup.close();
      }, 1000);
    } else {
      $state.go("sellermyshop", {
        sellerId: sellerId
      });
    }
  };

  $scope.listDisplay = true;
  $scope.gridDisplay = false;

  $scope.changeDisplay = function () {
    $scope.listDisplay = !$scope.listDisplay;
    $scope.gridDisplay = !$scope.gridDisplay;
  };
  $ionicModal
    .fromTemplateUrl("templates/modal/filter-modal.html", {
      scope: $scope,
      animation: "slide-in-up"
    })
    .then(function (modal) {
      $scope.filterModal = modal;
    });
  $scope.openFilterModal = function () {
    $scope.filterModal.show();
  };

  $scope.closeFilterModal = function () {
    $scope.filterModal.hide();
  };

  $rootScope.$on("$stateChangeSuccess", function (
    event,
    toState,
    toParams,
    fromState,
    fromParams
  ) {
    if (toState.name == "app.requirement-list") {
      $scope.getSellers($scope.keyword, "controller");
    }
  });
  $scope.scrollToTop = function () {
    $scope.productsLoading = true;
    $timeout(function () {
      $scope.page = 0;
      $scope.userSellers = [];
      $scope.usersLoaded = false;
      $scope.usersLoading = false;
      if (!!dataFetcher) dataFetcher.abort();
      $scope.isRefreshing = true;
      $scope.getSellers($scope.keyword, "controller");
    }, 500);
  }
});
