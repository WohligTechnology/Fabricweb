myApp.controller("RequirementListCtrl", function (
  $scope,
  $state,
  Navigation,
  $ionicModal,
  $ionicSlideBoxDelegate,
  ionicToast,
  $ionicPopup,
  $rootScope,
  $timeout,
  $ionicScrollDelegate
) {
  var dataFetcher = null;
  $scope.dataLoading = false;
  $scope.formData = {
    page: 0,
    owner: $.jStorage.get("userInfo")._id
  }
  $scope.goBackHandler = function () {
    Navigation.gobackHandler(); //This works
  };
  $scope.onLoad = function () {
    if (!$scope.dataLoading) {
      $scope.formData.page = $scope.formData.page + 1;
      $scope.dataLoading = true;
      if (_.isEmpty($scope.ReqList)) {
        $scope.ReqList = [];
      }
      Navigation.commonAPIWithoutLoader("Product/getRequirementOfbuyer", $scope.formData, function (data) {
        $timeout(function () {
          $scope.pullToRefreshWorking = false;
        }, 5000);
        if ($scope.isRefreshing) {
          $scope.$broadcast('scroll.refreshComplete');
          $scope.isRefreshing = false;
        }
        $scope.dataLoading = false;
        if (data.data.value) {
          if (_.isEmpty(data.data.data)) {
            $scope.dataLoaded = true;
          } else {
            $scope.ReqList = _.concat(
              $scope.ReqList,
              data.data.data
            );
          }
          $scope.$broadcast("scroll.infiniteScrollComplete");
          $timeout(function () {
            $ionicScrollDelegate.$getByHandle('mainScroll').resize();
          });
        }
      });
    }
  };
  $scope.onLoad();
  /**Opens Modal for the whole view */
  $ionicModal
    .fromTemplateUrl("templates/modal/buyer-post-requirement.html", {
      scope: $scope,
      animation: "slide-in-up"
    })
    .then(function (modal) {
      $scope.buyerPostrequirementModal = modal;
    });
  if (!$scope.showCheckBox) {
    $scope.openRequirementDetails = function (requirement) {
      $scope.reqDetail = requirement;
      $scope.requirementChunk = _.chunk(requirement.images, 3);
      $scope.buyerPostrequirementModal.show();
    };
    $scope.closeRequirementDetails = function () {
      $scope.buyerPostrequirementModal.hide();
    };
  }
  /**Gallery pop up for image Post requirement */
  $ionicModal
    .fromTemplateUrl("templates/modal/gallery.html", {
      scope: $scope,
      animation: "slide-in-up"
    })
    .then(function (modal) {
      $scope.modal = modal;
    });
  $scope.openModal = function (outerIndex, innerIndex, image) {
    $scope.singleImage = image;
    var value = 3 * outerIndex + innerIndex;
    $ionicSlideBoxDelegate.slide(value);
    $scope.modal.show();
    $scope.product = {};
    $scope.product.images = $scope.reqDetail.images;
  };
  $scope.closeModal = function () {
    $scope.modal.hide();
  };
  /**Gallery End */
  $scope.onInfinite = function () {
    if (!$scope.pullToRefreshWorking) {
      if (!!dataFetcher) dataFetcher.abort();
      $scope.onLoad();
    }
  }
  /**Function to show checkbox on Long press */
  $scope.showCheckBox = false;
  $scope.onHold = function () {
    $scope.showCheckBox = !$scope.showCheckBox;
  };
  $scope.delete = function () {
    var arr = _.map(
      _.filter($scope.ReqList, function (req) {
        return req.showCheck;
      }),
      function (req) {
        return req._id;
      }
    );
    if (arr.length > 1) {
      items = "items";
    } else {
      items = "item";
    }
    if (arr.length > 0) {
      $ionicPopup.show({
        title: "",
        subTitle: "Are you sure you want to Delete " + arr.length + " " + items + " ?",
        scope: $scope,
        cssClass: "logoutPopup",
        buttons: [{
            text: "<b>Yes</b>",
            type: "button-positive",
            onTap: function (e) {
              Navigation.commonAPICall(
                "Product/removeRequirementProduct", {
                  products: arr
                },
                function (data) {
                  if (data.data.value) {
                    $scope.onLoad();
                    ionicToast.show(arr.length + " " + items + "Deleted");
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
    } else {
      $ionicPopup.show({
        title: "",
        subTitle: "Please select from the requirement list ",
        scope: $scope,
        cssClass: "logoutPopup color-red",
        buttons: [{
          type: "button-positive",
          text: "Close"
        }]
      });
      // $timeout(function() {
      //   $ionicPopup.hide();
      // }, 500);
    }
  };
  $rootScope.$on("$stateChangeSuccess", function (
    event,
    toState,
    toParams,
    fromState,
    fromParams
  ) {
    if (toState.name == "search-seller") {
      $scope.onLoad();
    }
  });

  $scope.scrollToTop = function () {
    $scope.pullToRefreshWorking = true;
    $timeout(function () {
      $scope.ReqList = [];
      $scope.formData.page = 0;
      $scope.dataLoaded = false;
      $scope.dataLoading = false;
      if (!!dataFetcher) dataFetcher.abort();
      $scope.isRefreshing = true;
      $scope.onLoad();
    }, 500);
  }
});
