myApp.controller("BuyersDetailCtrl", function (
  $scope,
  $state,
  $stateParams,
  $ionicHistory,
  Navigation,
  ionicToast,
  $ionicPopup,
  $ionicModal,
  $ionicSlideBoxDelegate
) {

  $scope.alreadyAdded = false;

  if ($stateParams.buyerId) {
    Navigation.commonAPICall("User/getOne", {
      _id: $stateParams.buyerId
    }, function (data) {
      if (data.data.value) {
        $scope.buyer = data.data.data;
        $scope.userEndProdChunk = _.chunk($scope.buyer.endProduct, 2);
        $scope.fullAddress = "";
        if ($scope.buyer.gstAddress)
          $scope.fullAddress += $scope.buyer.gstAddress;
        if ($scope.buyer.city)
          $scope.fullAddress += ', ' + $scope.buyer.city;
        if ($scope.buyer.state)
          $scope.fullAddress += ', ' + $scope.buyer.state;
        if ($scope.buyer.country)
          $scope.fullAddress += ', ' + $scope.buyer.country;

      }

      _.each(data.data.data.followUser, function (n) {
        if (n == $.jStorage.get('userInfo')._id) {
          $scope.alreadyAdded = true;
        } else {
          $scope.alreadyAdded = false;
        }
      })
    })
  }
  $scope.Blocked = false;

  /**Follow a user */
  /*
  $scope.followMe = function (sellerId) {
    Navigation.commonAPICall("User/followUser", {
      follower: $.jStorage.get('userInfo'),
      follow: sellerId
    }, function (data) {
      if (data.data.value) {
        ionicToast.show("Followed", 'middle');
        $scope.alreadyAdded = true;
        // $scope.callThis();
      }
    });
  }

  $scope.unFollow = function (sellerId) {

    $ionicPopup.show({
      title: '',
      subTitle: 'Are you sure you want to Unfollow?',
      scope: $scope,
      cssClass: "logoutPopup",
      buttons: [{
          text: '<b>Yes</b>',
          type: 'button-positive',
          onTap: function (e) {
            Navigation.commonAPICall("User/unfollow", {
              follower: $.jStorage.get('userInfo')._id,
              follow: sellerId
            }, function (data) {
              if (data.data.value) {
                ionicToast.show("Unfollowed", 'middle');
                $scope.alreadyAdded = false;
              }
            })
          }
        },
        {
          text: 'No'
        }
      ]
    })
  }
*/
  $scope.blocked = false;
  $scope.blockThisUser = function (BuyerID) {
    Navigation.commonAPICall("BlockList/blockUser", {
      blockedBy: $.jStorage.get('userInfo'),
      blockedTo: BuyerID
    }, function (data) {
      if (data.data.value) {
        // console.log("Blocked", data);
        $scope.blocked = true;
        ionicToast.show($scope.buyer.name + 'has been Blocked');
      }
    })
  }

  $scope.goBackHandler = function () {
    Navigation.gobackHandler(); //This works
  };

  /**To open End Products view in gallery */
  $ionicModal
    .fromTemplateUrl("templates/modal/gallery.html", {
      scope: $scope,
      animation: "slide-in-up"
    })
    .then(function (modal) {
      $scope.modal = modal;
    });


  $scope.openModal = function (image) {
    $ionicSlideBoxDelegate.slide(0);
    $scope.product = {};
    $scope.product.images = [];
    $scope.product.images.push(image);
    console.log($scope.product.image);
    $scope.modal.show();
  };

  $scope.closeModal = function () {
    $scope.modal.hide();
  };

  /**Gallery End */
});
