myApp.controller("ForgotMobileCtrl", function(
  $scope,
  Navigation,
  $state,
  $stateParams,
  ionicToast
) {
  $scope.goBackHandler = function() {
    Navigation.gobackHandler();
  };
  $scope.forgotMobile = function(data) {
    $.jStorage.set("mobilenumber", data);
    Navigation.commonAPICall("User/createOTPOnForgot", data, function(data) {
      if (data.data.value) {
        // console.log("datataaa", data.data.data);
        $state.go("forgot-otp", {
          userId: data.data.data._id
        });
      } else {
        ionicToast.show("Enter Valid Registered Mobile Number");
      }
    });
  };
});
