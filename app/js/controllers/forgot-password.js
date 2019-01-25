myApp.controller("ForgotPasswordCtrl", function(
  $scope,
  Navigation,
  $state,
  $stateParams,
  ionicToast
) {
  $scope.goBackHandler = function() {
    Navigation.gobackHandler();
  };
  $scope.resendOtp = false;
  ($scope.userOtp = ""),
    ($scope.submit = function(formData) {
      // console.log(formData);
      $scope.otpPromise = Navigation.commonAPICall(
        "User/newPassword",
        {
          user: $stateParams.userId,
          password: formData.password
        },
        function(data) {
          if (data.data.value) {
            $state.go("login");
            ionicToast.show("Password reset successfully");
          } else {
            // ionicToast.show("Please Enter Valid OTP");
          }
        }
      );
    });

  $scope.resendOtpRequest = function() {
    Navigation.commonAPICall(
      "User/sendOtp",
      {
        mobile: $.jStorage.get("signUpInfo").mobile
      },
      function(data) {
        // console.log("da");
      }
    );
  };
});
