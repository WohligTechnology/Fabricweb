myApp.controller("SellerProfileCtrl", function(
  $scope,
  $state,
  $stateParams,
  Navigation,
  ionicToast,
  $ionicPopup,
  $ionicModal,
  $ionicSlideBoxDelegate
) {
  if ($stateParams.sellerId) {
    Navigation.commonAPICall(
      "User/getOne",
      {
        _id: $stateParams.sellerId
      },
      function(data) {
        if (data.data.value) {
          // console.log("Seller Data::", data.data.data);
          $scope.seller = data.data.data;
          $scope.fullAddress = "";

          if ($scope.seller) {
            if ($scope.seller.gstAddress)
              $scope.fullAddress += $scope.seller.gstAddress;
            if ($scope.seller.city)
              $scope.fullAddress += ", " + $scope.seller.city;
            if ($scope.seller.state)
              $scope.fullAddress += ", " + $scope.seller.state;
            if ($scope.seller.country)
              $scope.fullAddress += ", " + $scope.seller.country;
          }

          if ($scope.seller.isBuyer && $scope.seller.endProduct.length > 0) {
            $scope.seller.endProductChunk = _.chunk(
              $scope.seller.endProduct,
              2
            );
          }
          if ($.jStorage.get("userInfo").isBuyer) {
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
          }

          if ($.jStorage.get("userInfo").isSeller) {
            _.each($.jStorage.get("userInfo").followUser, function(n) {
              if (n == $stateParams.sellerId) {
                $scope.alreadyAdded = true;
              }
            });
          }
          // Navigation.commonAPICall("User/getOne", {
          //   _id: $.jStorage.get('userInfo')._id
          // }, function (data) {
          //   if (data.data.value) {
          //     // console.log("Seller Data::", data.data.data);

          //   }
          // })
        }
      }
    );
  }

  $scope.followMe = function(sellerId) {
    Navigation.commonAPICall(
      "User/followUser",
      {
        follower: $.jStorage.get("userInfo"),
        follow: sellerId
      },
      function(data) {
        console.log("Followed::::", data);
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
            Navigation.commonAPICall(
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

  /**For Blocking buyer */
  $scope.blocked = false;
  $scope.blockThisUser = function(BuyerID) {
    Navigation.commonAPICall(
      "BlockList/blockUser",
      {
        blockedBy: $.jStorage.get("userInfo"),
        blockedTo: BuyerID
      },
      function(data) {
        if (data.data.value) {
          // console.log("Blocked", data);
          $scope.blocked = true;
          ionicToast.show($scope.buyer.name + "has been Blocked");
        }
      }
    );
  };

  // $scope.readonly = true;
  $scope.goBackHandler = function() {
    Navigation.gobackHandler(); //This works
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
});
