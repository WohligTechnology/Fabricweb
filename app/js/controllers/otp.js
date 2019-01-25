myApp.controller("OtpCtrl", function(
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
    ($scope.submit = function() {
      $scope.otpPromise = Navigation.commonAPICall(
        "User/verifyOtp",
        {
          otp: $scope.userOtp,
          user: $stateParams.userId,
          checkExpiry: false
        },
        function(data) {
          if (data.data.value) {
            console.log("datataaa", data.data.data);
            $state.go("buyer-seller", {
              id: data.data.data._id
            });
          } else {
            console.log("data::", data);
            $scope.resendOtp = true;
            $scope.userOtp = "";
            ionicToast.show("Please Enter Valid OTP");
          }
        }
      );
    });

  $scope.resendOtpRequest = function() {
    $scope.otpPromise = Navigation.commonAPICall(
      "User/sendOtp",
      {
        mobile: $stateParams.mobile
      },
      function(data) {
        console.log("da");
      }
    );
  };
});
