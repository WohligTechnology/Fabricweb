myApp.controller("ProductDetailCtrl", function (
  $scope,
  $ionicModal,
  $stateParams,
  Navigation,
  ionicToast,
  $state,
  $ionicPopup,
  $ionicActionSheet,
  $ionicSlideBoxDelegate,
  $ionicHistory
) {
  $scope.goBackHandler = function () {
    if ($ionicHistory.backView()) {
      var stateName = $ionicHistory.backView().stateName;
      var stateParams = $ionicHistory.backView().stateParams;
      if (stateName === "add-new-product") {
        $state.go("tab.myshop");
        // $state.go("inner-shop", {
        //   category: $scope.product.category._id,
        //   subCategory: $scope.product.subCategory._id
        // });
      } else {
        Navigation.gobackHandler(); //This works
      }
    }
    // $state.go("app.sellertab", {
    //   tab: "myshop",
    //   id: $.jStorage.get("UserId")
    // });
  };
  if ($stateParams.productId) {
    Navigation.commonAPICall(
      "Product/getOne", {
        _id: $stateParams.productId
      },
      function (data) {
        console.log("data-->", data);
        if (data.data.value) {
          $scope.product = data.data.data;
          console.log("$scope.user", $scope.product);
          // $scope.categories = $scope.user.category;
          // $scope.loadData();
        }
      }
    );
  }
  $ionicModal
    .fromTemplateUrl("templates/modal/delete-confirm.html", {
      scope: $scope,
      animation: "slide-left-right"
    })
    .then(function (modal) {
      $scope.togglenotificationModal = modal;
    });
  $scope.opentogglenotificationModal = function () {
    $scope.togglenotificationModal.show();
  };
  $scope.closetogglenotificationModal = function () {
    $scope.togglenotificationModal.hide();
  };
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
            id: $stateParams.id ? $stateParams.id : $.jStorage.get("UserId"),
            product: product._id
          });
        } else {
          console.log("inside popup");
          var confirmPopup = $ionicPopup.confirm({

            template: "Do you permanently want to delete this product?",
            cssClass: "logoutPopup",
            buttons: [{
                text: "<b>Yes</b>",
                type: "button-assertive",
                onTap: function (e) {
                  //don't allow the user to close unless he enters model...
                  Navigation.commonAPICall(
                    "Product/delete", {
                      _id: product._id
                    },
                    function (data) {
                      var obj = {};
                      obj.id = $stateParams.id;
                      if ($stateParams.subCategory) {
                        obj.subCategory = $stateParams.subCategory;
                      }
                      if ($stateParams.category) {
                        obj.category = $stateParams.category;
                      }
                      // $state.go("tab.myshop");
                      $scope.goBackHandler();
                    }
                  );
                }
              },
              {
                text: "No",
                type: "button-positive"
              }
            ]
          });

          confirmPopup.then(function (res) {
            if (res) {
              console.log("Sure!");
              Navigation.commonAPICall(
                "Product/delete", {
                  _id: product._id
                },
                function (data) {
                  var obj = {};
                  obj.id = $stateParams.id;
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
              console.log("Not sure!");
            }
          });
        }
        return true;
      }
    });
  };
  $ionicModal
    .fromTemplateUrl("templates/modal/seller-profile-modal.html", {
      scope: $scope,
      animation: "slide-in-up"
    })
    .then(function (modal) {
      $scope.buyerProfileModal = modal;
    });
  $scope.openSellerProfileModal = function () {
    $scope.buyerProfileModal.show();
  };

  $scope.closeSellerProfileModal = function () {
    $scope.buyerProfileModal.hide();
  };
  $scope.sliderData = {};
  var setupSlider = function () {
    //some options to pass to our slider
    $scope.sliderData.sliderOptions = {
      initialSlide: 0,
      direction: "horizontal", //or vertical
      speed: 300, //0.3s transition
      autoplay: 5000
    };
    //create delegate reference to link with slider
    $scope.sliderData.sliderDelegate = null;
    //watch our sliderDelegate reference, and use it when it becomes available
    $scope.$watch("data.sliderDelegate", function (newVal, oldVal) {
      if (newVal != null) {
        $scope.sliderData.sliderDelegate.on("slideChangeEnd", function () {
          $scope.sliderData.currentPage =
            $scope.sliderData.sliderDelegate.activeIndex;
          //use $scope.$apply() to refresh any content external to the slider
          $scope.$apply();
        });
      }
    });
  };
  setupSlider();

  $ionicModal
    .fromTemplateUrl("templates/modal/gallery.html", {
      scope: $scope,
      animation: "slide-in-up"
    })
    .then(function (modal) {
      $scope.modal = modal;
    });

  $scope.openModal = function (value, image) {
    $scope.singleImage = image;
    $ionicSlideBoxDelegate.slide(value);
    $scope.modal.show();
  };

  $scope.closeModal = function () {
    $scope.modal.hide();
  };

  // Cleanup the modal when we're done with it!
  $scope.$on("$destroy", function () {
    $scope.modal.remove();
  });
  // Execute action on hide modal
  $scope.$on("modal.hide", function () {
    // Execute action
  });
  // Execute action on remove modal
  $scope.$on("modal.removed", function () {
    // Execute action
  });
  $scope.$on("modal.shown", function () {
    console.log("Modal is shown!");
  });

  // Call this functions if you need to manually control the slides
  $scope.next = function () {
    $ionicSlideBoxDelegate.next();
  };

  $scope.previous = function () {
    $ionicSlideBoxDelegate.previous();
  };

  $scope.goToSlide = function (index) {
    $scope.modal.show();
    $ionicSlideBoxDelegate.slide(index);
  };

  // Called each time the slide changes
  $scope.slideChanged = function (index) {
    $scope.slideIndex = index;
  };
});
