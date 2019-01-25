myApp.controller("SignupCtrl", function (
  $scope,
  Navigation,
  $state,
  ionicToast,
  $ionicHistory,
  Navigation,
  $timeout,
  $ionicPlatform
) {
  // if (!_.isEmpty($.jStorage.get("userInfo"))) {
  //   $state.go("tab.myshop");
  // }
  $scope.formData = {};
  $scope.submit = function () {
    if (!_.isEqual($scope.formData.password, $scope.formData.confirmPassword)) {
      ionicToast.show("Password & Confirm Password does not match", "middle");
    } else {
      $scope.signupPromise = Navigation.signUp(
        "User/signUp",
        $scope.formData,
        function (data) {
          console.log("Data", data);
          if (data.data.value) {
            $.jStorage.set("userState", {
              id: data.data.data._id,
              mobile: $scope.formData.mobile
            });
            console.log("data.data._id", data.data.data._id);
            $state.go("otp", {
              userId: data.data.data._id,
              mobile: $scope.formData.mobile
            });
            $ionicPlatform.ready(function () {
              if (window.plugins.OneSignal) {
                var notificationOpenedCallback = function (jsonData) {};
                window.plugins.OneSignal.startInit(
                    "46aab31d-3e3e-4e00-b303-4b0848306c70"
                  )
                  .handleNotificationOpened(notificationOpenedCallback)
                  .inFocusDisplaying(
                    window.plugins.OneSignal.OSInFocusDisplayOption.Notification
                  )
                  .endInit();
                window.plugins.OneSignal.getIds(function (ids) {
                  // console.log('getIds: ' + JSON.stringify(ids));
                  // $rootScope.deviceId = ids.userId;
                  $.jStorage.set("deviceId", ids.userId);
                  mySocket.on(
                    "deviceId_" + data.data.data._id,
                    function onConnect(socketData) {
                      Navigation.commonAPIWithoutLoader(
                        "user/getOne", {
                          _id: data.data.data._id,
                          checkExpiry: false
                        },
                        function (data) {
                          if (data.data.data.deviceId !== ids.userId) {
                            startApplication();
                            location.reload();
                            $.jStorage.flush();
                            $state.go("login");
                          }
                          console.log("done");
                        }
                      );
                    }
                  );
                  Navigation.commonAPIWithoutLoader(
                    "user/updateDeviceId", {
                      _id: data.data.data._id,
                      deviceId: ids.userId,
                      checkExpiry: false
                    },
                    function (data) {
                      console.log("done");
                    }
                  );
                });
              }
            });
            // $state.go("buyer-seller", {
            //   id: data.data.data._id
            // });
          } else if (data.data.error === "userAlreadyExist") {
            ionicToast.show("User Already Registered", "middle");
          }
        }
      );
    }
  };

  $scope.goBackHandler = function () {
    Navigation.gobackHandler();
  };
});
