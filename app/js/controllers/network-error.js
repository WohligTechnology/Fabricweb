myApp.controller("NetworkErrorCtrl", function (
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
  $cordovaImagePicker

) {
  $scope.goBackHandler = function () {
    Navigation.gobackHandler(); //This works
  };

  $scope.tryAgain = function () {
    // $state.reload();
  }
});
