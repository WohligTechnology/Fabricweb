myApp.controller("ProfileCtrl", function (
  $scope,
  $ionicModal,
  $stateParams,
  Navigation,
  ionicToast,
  $state,
  $ionicActionSheet,
  $cordovaCamera,
  $cordovaFileTransfer,
  $cordovaImagePicker,
  $ionicPopup
) {

  $scope.changed = false;
  $scope.goBackHandler = function () {
    // Navigation.gobackHandler(); //This works

    if ($scope.changed) {
      $ionicPopup.show({
        title: 'PROFILE',
        subTitle: 'Do you want to discard the changes?',
        scope: $scope,
        cssClass: "logoutPopup",
        buttons: [{
            text: '<b>Yes</b>',
            type: 'button-positive',
            onTap: function (e) {
              $state.go("tab.myshop");
            }
          },
          {
            text: 'No',
            onTap: function (e) {}
          }
        ]
      })
    } else {
      $state.go("tab.myshop");
    }
  };
  $stateParams.id = $.jStorage.get("UserId");
  $scope.getUserInfo = function () {
    Navigation.commonAPICall(
      "User/getOne", {
        _id: $stateParams.id
      },
      function (data) {
        if (data.data.value) {
          $scope.user = data.data.data;
          $scope.user.mobile = $scope.user.mobile ? parseInt($scope.user.mobile) : '';
          console.log("$scope.user-->", $scope.user);
        }
      }
    );
  }
  $scope.getUserInfo();
  $scope.saveUser = function () {
    console.log("Here");
    Navigation.commonAPICall("User/save", $scope.user, function (data) {
      if (data.data.value) {
        $scope.changeReadonly();
        ionicToast.show("User Saved Successfully", 'middle');
        // Navigation.gobackHandler();
      }
    });
  };

  $scope.readonly = true;
  $scope.changeReadonly = function () {
    $scope.changed = false;
    $scope.readonly = !$scope.readonly;
    if ($scope.readonly) {
      $scope.getUserInfo();
    }
  };
  $scope.uploadedimg=function(data){
    $scope.user.photo = data[0];
    Navigation.commonAPICall("User/save", $scope.user, function (data) {
      if (data.data.value) {
        ionicToast.show("User Saved Successfully", 'middle');
      }
    });
  }
  $scope.adducimage = function (maxImage) {
    Navigation.showActionsheet(true, null, maxImage, function (Images) {
      $scope.user.photo = Images[0];
      Navigation.commonAPICall("User/save", $scope.user, function (data) {
        if (data.data.value) {
          ionicToast.show("User Saved Successfully", 'middle');
        }
      });
    });
  };

  $scope.$watchCollection('user', function (newValues) {
    if (!$scope.readonly) {
      $scope.changed = true;
    }
  });
});
