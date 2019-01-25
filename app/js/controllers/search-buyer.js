myApp.controller("SearchBuyerCtrl", function(
  $scope,
  $ionicModal,
  Navigation,
  $state,
  $ionicPopup,
  $timeout
) {
  $scope.goBackHandler = function() {
    Navigation.gobackHandler(); //This works
  };
});
