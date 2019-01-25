myApp.controller("FeedbackCtrl", function (
  $scope,
  $ionicModal,
  ionicToast,
  $state,
  Navigation
) {
  $scope.ratingFull = {};
  $scope.ratingFull.rate = 3;
  $scope.ratingFull.max = 5;
  $scope.data = {
    rate: 0,
    description: ""
  };
  $scope.ratingHalf = {};
  $scope.ratingHalf.rate = 3.5;
  $scope.ratingHalf.max = 5;
  $scope.rateUs = function (e) {
    $scope.data.rate = e.rating;
  }
  $scope.reset = function () {
    $scope.data.rate = 0;
  };
  $ionicModal
    .fromTemplateUrl("templates/modal/save-feedback.html", {
      scope: $scope,
      animation: "slide-left-right"
    })
    .then(function (modal) {
      $scope.savefeedbackModal = modal;
    });
  $scope.opensavefeedbackModal = function () {
    $scope.data.user = $.jStorage.get("userInfo")._id;
    if ($scope.data.rate == 0 || _.isEmpty($scope.data.description)) {
      console.log("***************");
      ionicToast.show("Please Enter Info", 'middle');
    } else {
      Navigation.commonAPICall("Feedback/save", $scope.data, function (data) {
        if (data.data.value) {
          $scope.savefeedbackModal.show();
        } else {
          ionicToast.show("Feedback submission failed");
        }
      });
      // $scope.data = null;
      // $scope.data.rates = {rating:0};
    }
  };
  $scope.goBackHandler = function () {
    Navigation.gobackHandler();
  };
  $scope.closesavefeedbackModal = function () {
    $scope.savefeedbackModal.hide();
    $state.reload();
  };
});
