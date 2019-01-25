myApp.controller("LoginCtrl", function (
  $scope,
  Navigation,
  $state,
  ionicToast,
  $timeout,
  $ionicPlatform
) {
  $scope.formData = {};
  $scope.formData.mobile = "";
  $scope.formData.password = "";
  $scope.login = function () {
    // console.log(
    //   "$scope.formData.password",
    //   $scope.formData,
    //   $scope.formData.password
    // );
    if (
      !_.isEmpty($scope.formData.mobile) ||
      !_.isEmpty($scope.formData.password)
    ) {
      // console.log("$scope.formData", $scope.formData);
      $scope.loginPromise = Navigation.signUp(
        "User/login",
        $scope.formData,
        function (data) {
          {
            console.log("Data-->", data);
            if (data.data.value) {
              $.jStorage.set("userInfo", data.data.data);
              // console.log("data.data.data.isSeller", data.data.data.isSeller);
              if (data.data.data.isSeller) {
                $state.go("tab.myshop");
              } else if (data.data.data.isBuyer) {
                $state.go("tab.market");
              }
              $ionicPlatform.ready(function () {
                if (window.plugins.OneSignal) {
                  var notificationOpenedCallback = function (jsonData) {};
                  window.plugins.OneSignal.startInit(
                      "46aab31d-3e3e-4e00-b303-4b0848306c70"
                    )
                    .handleNotificationOpened(notificationOpenedCallback)
                    .inFocusDisplaying(
                      window.plugins.OneSignal.OSInFocusDisplayOption
                      .Notification
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
            } else {
              ionicToast.show("Please Enter Valid Details", "middle");
            }
          }
        }
      );
    } else {
      ionicToast.show("Please Enter Mobile and Password", "middle");
    }
  };
});
