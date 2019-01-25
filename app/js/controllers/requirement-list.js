myApp.controller("RequirementListCtrl", function(
  $scope,
  $state,
  Navigation,
  $ionicModal,
  $ionicSlideBoxDelegate,
  ionicToast,
  $ionicPopup
) {
  $scope.goBackHandler = function() {
    Navigation.gobackHandler(); //This works
  };
  $scope.onLoad = function() {
    Navigation.commonAPIWithoutLoader(
      "Product/getRequirementOfbuyer",
      {
        owner: $.jStorage.get("userInfo")._id,
        page: 1
      },
      function(data) {
        if (data.data.value) {
          $scope.ReqList = data.data.data;
        }
      }
    );
  };
  $scope.onLoad();
  /**Opens Modal for the whole view */
  $ionicModal
    .fromTemplateUrl("templates/modal/buyer-post-requirement.html", {
      scope: $scope,
      animation: "slide-in-up"
    })
    .then(function(modal) {
      $scope.buyerPostrequirementModal = modal;
    });
  if (!$scope.showCheckBox) {
    $scope.openRequirementDetails = function(requirement) {
      $scope.reqDetail = requirement;
      $scope.requirementChunk = _.chunk(requirement.images, 3);
      $scope.buyerPostrequirementModal.show();
    };
    $scope.closeRequirementDetails = function() {
      $scope.buyerPostrequirementModal.hide();
    };
  }
  /**Gallery pop up for image Post requirement */
  $ionicModal
    .fromTemplateUrl("templates/modal/gallery.html", {
      scope: $scope,
      animation: "slide-in-up"
    })
    .then(function(modal) {
      $scope.modal = modal;
    });
  $scope.openModal = function(outerIndex, innerIndex, image) {
    $scope.singleImage = image;
    var value = 3 * outerIndex + innerIndex;
    $ionicSlideBoxDelegate.slide(value);
    $scope.modal.show();
    $scope.product = {};
    $scope.product.images = $scope.reqDetail.images;
  };
  $scope.closeModal = function() {
    $scope.modal.hide();
  };
  /**Gallery End */

  /**Function to show checkbox on Long press */
  $scope.showCheckBox = false;
  $scope.onHold = function() {
    $scope.showCheckBox = !$scope.showCheckBox;
  };
  $scope.delete = function() {
    var arr = _.map(
      _.filter($scope.ReqList, function(req) {
        console.log("$scope.ReqList", req.showCheck);
        return req.showCheck;
      }),
      function(req) {
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
        subTitle:
          "Are you sure you want to Delete " + arr.length + " " + items + " ?",
        scope: $scope,
        cssClass: "logoutPopup",
        buttons: [
          {
            text: "<b>Yes</b>",
            type: "button-positive",
            onTap: function(e) {
              Navigation.commonAPICall(
                "Product/removeRequirementProduct",
                {
                  products: arr
                },
                function(data) {
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
        buttons: [
          {
            type: "button-positive",
            text: "Close"
          }
        ]
      });
      // $timeout(function() {
      //   $ionicPopup.hide();
      // }, 500);
    }
  };
});
