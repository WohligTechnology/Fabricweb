myApp.controller("BuyerMyShopCtrl", function($scope, $ionicModal) {
  // welcome buyer modal
  $ionicModal
    .fromTemplateUrl("templates/modal/welcome-buyer.html", {
      scope: $scope,
      animation: "slide-down-up"
    })
    .then(function(modal) {
      $scope.welcomebuyerModal = modal;
    });
  $scope.openWelcomeBuyerModal = function() {
    console.log("openModal");
    $scope.welcomebuyerModal.show();
  };

  $scope.closeWelcomeBuyerModal = function() {
    $scope.welcomebuyerModal.hide();
  };
});
