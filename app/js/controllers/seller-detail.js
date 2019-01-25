myApp.controller("SellerDetailCtrl", function($scope, Navigation) {
  $scope.goBackHandler = function() {
    Navigation.gobackHandler(); //This works
  };
});
