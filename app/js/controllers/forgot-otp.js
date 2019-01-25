myApp.controller("ForgotOtpCtrl", function (
  $scope,
  Navigation,
  $state,
  $stateParams,
  ionicToast
) {
  $scope.goBackHandler = function () {
    Navigation.gobackHandler();
  };
  $scope.resendOtp = false;
  $scope.userOtpSubmit = function (userOtp) {
    // console.log(userOtp);
    Navigation.commonAPICall(
      "User/verifyOtp", {
        otp: userOtp,
        user: $stateParams.userId
      },
      function (data) {
        if (data.data.value) {
          // console.log("datataaa", data.data.data);
          $state.go("forgot-password", {
            userId: data.data.data._id
          });
        } else {
          $scope.resendOtp = true;
          $scope.userOtp = "";
          ionicToast.show("Please Enter Valid OTP");
        }
      }
    );
  };

  $scope.resendOtpRequest = function () {
    Navigation.commonAPICall(
      "User/sendOtp", {
        mobile: $.jStorage.get("mobilenumber").mobile
      },
      function (data) {
        // console.log("da");
      }
    );
  };
});
