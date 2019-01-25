myApp.controller("SellerShopCtrl", function(
  $scope,
  ionicToast,
  $stateParams,
  $ionicModal,
  $state,
  Navigation,
  $timeout,
  $ionicPopup
) {
  if ($stateParams.sellerId) {
    Navigation.commonAPICall(
      "User/getOne",
      {
        _id: $stateParams.sellerId
      },
      function(data) {
        if (data.data.value) {
          $scope.sellerProfile = data.data.data;
          // _.each($scope.sellerProfile.followUser, function (n) {
          //   if (n == $.jStorage.get('userInfo')._id) {
          //     $scope.alreadyAdded = true;
          //   }
          // });
          Navigation.commonAPIWithoutLoader(
            "User/getOne",
            {
              _id: $.jStorage.get("userInfo")._id
            },
            function(data) {
              if (data.data.value) {
                _.each(data.data.data.followingUser, function(n) {
                  if (n == $stateParams.sellerId) {
                    $scope.alreadyAdded = true;
                  }
                });
              }
            }
          );

          var url = "User/getMyShopPageDetailsAccessories";
          if (data.data.data.isTextile) {
            url = "User/getMyShopPageDetails";
          }
          Navigation.commonAPIWithoutLoader(
            url,
            {
              _id: $stateParams.sellerId
            },
            function(data) {
              if (data.data.value) {
                $scope.user = data.data.data;
                // console.log("$scope.user :::>>>", $scope.user);
                $scope.categories = $scope.user.categoryArr;
                if ($scope.user.isTextile) {
                  _.each($scope.categories, function(n) {
                    // n.filter = true;
                    _.each(n.subCategory, function(m) {
                      m.filter = true;
                      m.applyFilter = true;
                    });
                    n.subCategoryChunk = _.chunk(n.subCategory, 2);
                  });
                  console.log($scope.categories);
                  // console.log("$scope.categories-->", $scope.categories);
                } else {
                  _.each($scope.categories, function(n) {
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
  }

  Navigation.commonAPIWithoutLoader(
    "User/statisticsPageHeader",
    {
      user: $stateParams.sellerId
    },
    function(data) {
      if (data.data.value) {
        console.log("Stats Data", data.data.data);
        $scope.sellerStats = data.data.data;
      }
    }
  );
  $scope.goToBuyerProductDetail = function(productId) {
    console.log("goToBuyerProductDetail");
    $state.go("buyer-product-detail", {
      id: $.jStorage.get("userInfo")._id,
      productId: productId
    });
  };

  $scope.goToInnerPageOfShop = function(subCategory) {
    console.log("subCategory", subCategory);
    $state.go("buyer-inner-shop", {
      sellerId: $stateParams.sellerId,
      // category: category._id,
      subCategory: subCategory._id
    });
  };

  $scope.goToInnerPageOfShopAccess = function(category) {
    console.log("category", category);
    $state.go("buyer-inner-shop", {
      sellerId: $stateParams.sellerId,
      category: category._id
    });
  };

  $ionicModal
    .fromTemplateUrl("templates/modal/sort-product-modal.html", {
      scope: $scope,
      animation: "fade-in"
    })
    .then(function(modal) {
      $scope.sortProductModal = modal;
    });
  $scope.openSortProductModal = function() {
    $scope.sortProductModal.show();
  };

  $scope.closeSortProductModal = function() {
    $scope.sortProductModal.hide();
  };

  Navigation.commonAPIWithoutLoader(
    "ViewPage/checkVisited",
    {
      seller: $stateParams.sellerId,
      buyer: $.jStorage.get("userInfo")
    },
    function(data) {
      if (data.data.value) {
        // console.log('checkVisited', data.data.data);
        $scope.shopVisited = data.data.data;
      }
      if ($scope.shopVisited == "false") {
        $ionicModal
          .fromTemplateUrl("templates/modal/welcome-buyer.html", {
            scope: $scope,
            animation: "slide-left-right"
          })
          .then(function(modal) {
            $scope.welcomeModal = modal;

            $scope.openwelcomeModal();
          });
        $scope.openwelcomeModal = function() {
          $scope.welcomeModal.show();
          $timeout(function() {
            $scope.closewelcomeModal();
          }, 2000);
        };

        $scope.closewelcomeModal = function() {
          $scope.welcomeModal.hide();
        };
      }
    }
  );

  $scope.followMe = function(sellerId) {
    Navigation.commonAPIWithoutLoader(
      "User/followUser",
      {
        follower: $.jStorage.get("userInfo"),
        follow: sellerId
      },
      function(data) {
        // console.log("Follow ME::::", data);
        if (data.data.value) {
          ionicToast.show("Followed", "middle");
          $scope.alreadyAdded = true;
        }
      }
    );
  };

  $scope.unFollow = function(sellerId) {
    $ionicPopup.show({
      title: "",
      subTitle: "Are you sure you want to Unfollow?",
      scope: $scope,
      cssClass: "logoutPopup",
      buttons: [
        {
          text: "<b>Yes</b>",
          type: "button-positive",
          onTap: function(e) {
            Navigation.commonAPIWithoutLoader(
              "User/unfollow",
              {
                follower: $.jStorage.get("userInfo")._id,
                follow: sellerId
              },
              function(data) {
                if (data.data.value) {
                  console.log("UnFollowed,", data.data.data);
                  ionicToast.show("Unfollowed", "middle");
                  $scope.alreadyAdded = false;
                }
              }
            );
          }
        },
        {
          text: "No"
        }
      ]
    });
  };

  $scope.goBackHandler = function() {
    Navigation.gobackHandler(); //This works
  };
});
