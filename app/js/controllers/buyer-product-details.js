myApp.controller("BuyerProductDetailCtrl", function(
  $scope,
  $state,
  $stateParams,
  Navigation,
  $ionicScrollDelegate,
  $ionicModal,
  $ionicActionSheet,
  $ionicHistory,
  ionicToast,
  Navigation,
  $ionicPopup,
  $timeout,
  $ionicSlideBoxDelegate
) {
  $scope.scrollTop = function() {
    $ionicScrollDelegate.scrollTop();
  };
  $scope.goBackHandler = function() {
    Navigation.gobackHandler(); //This works
  };

  /**To get the product id from state params for product details */
  $scope.formData = {};

  var getSimilarProducts = function() {
    Navigation.commonAPICall(
      "product/getProductForSearch",
      $scope.formData,
      function(products) {
        // console.log("Similar Products", products)
        if (products.data.value) {
          // $scope.prod = products.data.data;
          $scope.prod = products.data.data;
          _.each($scope.prod, function(n) {
            if (n._id != $stateParams.productId) {
              $scope.sellerProducts = _.concat($scope.sellerProducts, n);
            }
          });
          $scope.productChunk = _.chunk($scope.sellerProducts, 2);

          $scope.productChunk = _.slice($scope.productChunk, 0, 2);
          // console.log("Similar Product $scope.productChunk", $scope.productChunk);
        } else {
          console.log("out of API");
        }
      }
    );
  };
  $scope.getProduct = function() {
    $scope.userBlocked = false;
    if ($stateParams.productId) {
      Navigation.commonAPICall(
        "Product/getOne",
        {
          _id: $stateParams.productId
        },
        function(data) {
          console.log("data-->", data);
          if (data.data.value) {
            $scope.product = data.data.data;
            Navigation.commonAPIWithoutLoader(
              "BlockList/getBlockStatus",
              {
                blockedBy: $scope.product.owner._id,
                blockedTo: $.jStorage.get("userInfo")._id
              },
              function(data) {
                if (data.data.value && data.data.data == true) {
                  $scope.userBlocked = true;
                }
              }
            );
            // console.log("$scope.product", $scope.product);
            Navigation.commonAPIWithoutLoader(
              "User/getCategoryAndSubCategoryBuyer",
              {
                user: $scope.product.owner._id
              },
              function(data) {
                if (data.data.value) {
                  $scope.cat = data.data.data.category;
                }
              }
            );
            $scope.formData.category = $scope.product.category._id;
            $scope.formData.subCategory = $scope.product.subCategory._id;
            $scope.interestedFlag = false;
            $scope.favouriteFlag = false;
            var interestedFound = _.findIndex(
              $scope.product.interested,
              function(interested) {
                return interested === $.jStorage.get("UserId");
              }
            );
            if (interestedFound != -1) {
              $scope.interestedFlag = true;
            }
            var favouriteFound = _.findIndex($scope.product.favourite, function(
              favourite
            ) {
              return favourite === $.jStorage.get("UserId");
            });
            if (favouriteFound != -1) {
              $scope.favouriteFlag = true;
            }
            // $scope.formData.page = 0;
            getSimilarProducts();
          }
        }
      );
      Navigation.commonAPIWithoutLoader(
        "User/addRecentlyViewed",
        {
          product: $stateParams.productId,
          user: $.jStorage.get("UserId")
        },
        function(data) {}
      );
      Navigation.commonAPIWithoutLoader(
        "Product/viewedProduct",
        {
          product: $stateParams.productId,
          user: $.jStorage.get("UserId")
        },
        function(data) {}
      );
    }
  };
  $scope.getProduct();
  /**For getting similar products */
  $scope.sellerProducts = [];
  $scope.productChunk = [];
  /**For getting similar product detail on this page */
  $scope.goToBuyerProductDetail = function(productId) {
    console.log("goToBuyerProductDetail");
    $state.go("buyer-product-detail", {
      id: $stateParams.id,
      productId: productId
    });
  };

  $scope.viewAllSimilarProducts = function() {
    $state.go("similar-products", {
      id: $stateParams.id,
      categoryId: $scope.formData.category,
      subCategoryId: $scope.product.subCategory._id
    });
  };

  $scope.added = false;
  $scope.requestedData = {
    type: "",
    product: ""
  };
  $scope.sampleRequestSent = false;
  $scope.sendSampleRequest = function(type, product, flag) {
    if ($scope.userBlocked) {
      $scope.blockPopup();
    } else {
      $scope.requestedData.type = type;
      $scope.requestedData.product = product;
      $scope.requestedData.user = $.jStorage.get("userInfo");
      console.log("requestedData", $scope.requestedData);
      if (!flag) {
        $scope.sendSampleRequestAcceptPromise = Navigation.commonAPICall(
          "User/addToFavArray",
          $scope.requestedData,
          function(data) {
            console.log("Data::>>", data);
            if (data.data.value) {
              $scope.added = true;
              $scope.getProduct();
              if ($scope.requestedData.type != "sampleRequest") {
                ionicToast.show(
                  "Added To " +
                    _.startCase(_.toLower($scope.requestedData.type)),
                  "middle"
                );
              }
              if ($scope.requestedData.type == "sampleRequest") {
                $scope.sampleRequestSent = true;
                ionicToast.show(
                  "Sample Request sent for product " +
                    $scope.requestedData.product.name
                );
              }
            }
          }
        );
      } else {
        $scope.acceptNotificationDeclinePromise = Navigation.commonAPICall(
          "User/removeFormFavArray",
          $scope.requestedData,
          function(data) {
            console.log("Data::>>", data);
            if (data.data.value) {
              $scope.added = true;
              $scope.getProduct();
              if ($scope.requestedData.type != "sampleRequest") {
                ionicToast.show(
                  "Removed From " +
                    _.startCase(_.toLower($scope.requestedData.type)),
                  "middle"
                );
              }
            }
          }
        );
      }
    }
  };
  $ionicModal
    .fromTemplateUrl("templates/modal/gallery.html", {
      scope: $scope,
      animation: "slide-in-up"
    })
    .then(function(modal) {
      $scope.modal = modal;
    });

  $scope.openModal = function(value, image) {
    $scope.singleImage = image;
    console.log("$scope.singleImage /////////////", $scope.singleImage);
    $ionicSlideBoxDelegate.slide(value);
    $scope.modal.show();
  };

  $scope.closeModal = function() {
    $scope.modal.hide();
  };

  $scope.showActionsheet = function() {
    // Show the action sheet
    var hideSheet = $ionicActionSheet.show({
      buttons: [
        {
          text: " Edit"
        },
        {
          text: " Delete"
        }
      ],
      // destructiveText: "Delete",
      cancelText: "Cancel",
      cancel: function() {
        // add cancel code..
      },
      buttonClicked: function(index) {
        return true;
      }
    });
  };
  $ionicModal
    .fromTemplateUrl("templates/modal/seller-profile-modal.html", {
      scope: $scope,
      animation: "slide-in-up"
    })
    .then(function(modal) {
      $scope.buyerProfileModal = modal;
    });
  $scope.openSellerProfileModal = function() {
    if ($scope.userBlocked) {
      $scope.blockPopup();
    } else {
      $scope.buyerProfileModal.show();
    }
  };

  $scope.blockPopup = function() {
    var alertPopup = $ionicPopup.show({
      title: "Blocked",
      template: "You Have Been Blocked",
      cssClass: "logoutPopup"
    });
    $timeout(function() {
      alertPopup.close();
    }, 1000);
  };
  $scope.closeSellerProfileModal = function() {
    $scope.buyerProfileModal.hide();
  };
});
