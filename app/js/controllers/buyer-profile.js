myApp.controller("BuyerProfileCtrl", function(
  $scope,
  $state,
  $ionicHistory,
  $ionicModal,
  $stateParams,
  Navigation,
  ionicToast,
  $ionicActionSheet,
  $cordovaCamera,
  $cordovaFileTransfer,
  $cordovaImagePicker,
  $ionicPopup,
  $ionicSlideBoxDelegate
) {
  $scope.changed = false;
  $scope.goBackHandler = function() {
    // Navigation.gobackHandler(); //This works
    if ($scope.changed) {
      $ionicPopup.show({
        subTitle: "Do you want to discard the changes?",
        scope: $scope,
        cssClass: "logoutPopup",
        buttons: [
          {
            text: "<b>Yes</b>",
            type: "button-positive",
            onTap: function(e) {
              $state.go("tab.market");
            }
          },
          {
            text: "No",
            onTap: function(e) {}
          }
        ]
      });
    } else {
      $state.go("tab.market");
    }
  };

  $stateParams.id = $.jStorage.get("UserId");
  $scope.getUserInfo = function() {
    Navigation.commonAPICall(
      "User/getOne",
      {
        _id: $stateParams.id
      },
      function(data) {
        if (data.data.value) {
          $scope.user = data.data.data;
          $scope.user.mobile = $scope.user.mobile
            ? parseInt($scope.user.mobile)
            : "";
          console.log("$scope.user-->", $scope.user);
          // console.log("$scope.endProduct", $scope.user.endProduct);
          $scope.userEndProdChunk = _.chunk($scope.user.endProduct, 2);
        }
      }
    );
  };
  $scope.getUserInfo();
  $scope.saveUser = function() {
    console.log("Here");
    Navigation.commonAPICall("User/save", $scope.user, function(data) {
      if (data.data.value) {
        $scope.changeReadonly();
        ionicToast.show("User Saved Successfully", "middle");
        // Navigation.gobackHandler();
      }
    });
  };

  $scope.readonly = true;
  $scope.changeReadonly = function() {
    $scope.changed = false;
    $scope.readonly = !$scope.readonly;
    if ($scope.readonly) {
      $scope.getUserInfo();
    }
  };
  $scope.$watchCollection("user", function(newValues) {
    if (!$scope.readonly) {
      $scope.changed = true;
    }
  });

  $scope.adducimage = function(maxImage) {
    Navigation.showActionsheet(true, null, maxImage, function(Images) {
      $scope.user.photo = Images[0];
      Navigation.commonAPICall("User/save", $scope.user, function(data) {
        if (data.data.value) {
          ionicToast.show("User Saved Successfully", "middle");
        }
      });
    });
  };

  $ionicModal
    .fromTemplateUrl("templates/modal/add-end-products.html", {
      scope: $scope
    })
    .then(function(modal) {
      $scope.addendproduct = modal;
    });
  $scope.openAddEndProduct = function() {
    $scope.addendproduct.show();
  };

  $scope.closeAddEndProduct = function() {
    $scope.addendproduct.hide();
  };

  $scope.endProduct = {};

  $scope.addProduct = function(index, maxImage) {
    Navigation.showActionsheet(false, index, maxImage, function(Images) {
      if (!$scope.endProduct.images) {
        $scope.endProduct.image = [];
      }
      _.forEach(Images, function(value) {
        $scope.endProduct.image.push(value);
      });
    });
  };

  $scope.addInEndProduct = function() {
    $scope.addInEndProductPromise = Navigation.commonAPICall(
      "User/pushEndProduct",
      {
        user: $.jStorage.get("userInfo")._id,
        endProduct: $scope.endProduct
      },
      function(data) {
        if (data.data.value) {
          $scope.endProduct = {};
          console.log("Added in EndProducts");
          $scope.getUserInfo();
        }
      }
    );
  };

  $scope.removeEndProductImage = function(index) {
    _.pullAt($scope.endProduct.image, index);
    console.log("Image", $scope.endProduct.image);
  };

  /**To open End Products view in gallery */
  $ionicModal
    .fromTemplateUrl("templates/modal/gallery.html", {
      scope: $scope,
      animation: "slide-in-up"
    })
    .then(function(modal) {
      $scope.modal = modal;
    });

  $scope.openModal = function(image) {
    $ionicSlideBoxDelegate.slide(0);
    $scope.product = {};
    $scope.product.images = [];
    $scope.product.images.push(image);
    console.log($scope.product.image);
    $scope.modal.show();
  };

  $scope.closeModal = function() {
    $scope.modal.hide();
  };

  /**Gallery End */
  $scope.uploadedimg = function(data){
    $scope.user.photo = data[0];
    Navigation.commonAPICall("User/save", $scope.user, function(data) {
      if (data.data.value) {
        ionicToast.show("User Saved Successfully", "middle");
      }
    });
      }
});
