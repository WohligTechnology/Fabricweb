myApp.controller("AppCtrl", function (
  $scope,
  $ionicModal,
  $timeout,
  $state,
  $stateParams,
  Navigation,
  $ionicSideMenuDelegate,
  $cordovaSocialSharing,
  $ionicPopup,
  $cordovaInAppBrowser,
  $ionicHistory
) {
  $scope.userInfo = $.jStorage.get("userInfo");

  // if (!_.isEmpty($scope.userInfo)) {
  //   if ($scope.userInfo.isSeller) {
  //     $state.go("tab.myshop");
  //   } else if ($scope.userInfo.isBuyer) {
  //     $state.go("tab.market");
  //   }
  // }
  if (!_.isEmpty($.jStorage.get("userInfo"))) {
    var mySocket = io.sails.connect(adminSocket);
    mySocket.on("Notification_" + $.jStorage.get("userInfo")._id, function onConnect(data) {
      console.log("Notification_", data);
      // if (data == "done") {
      $scope.notificationFun();
      // }
    });
  }
  $scope.menuDirective = "templates/menu-directive.html";
  $scope.notificationFun = function () {
    if (!_.isEmpty($.jStorage.get("userInfo"))) {

      Navigation.commonAPIWithoutLoader(
        "Notification/notificationCount", {
          user: $.jStorage.get("userInfo")._id,
          notificationType: [
            "Request",
            "Follow",
            "Like",
            "Fav",
            "Interested",
            "PostRequirement",
            "Block"
          ]
        },
        function (data) {
          if (data.data.value) {
            $scope.notificationCount = data.data.data;
          }
        }
      );
    }
  };
  $scope.notificationFun();
  $scope.newlyAddedCount = function () {
    Navigation.commonAPIWithoutLoader(
      "Product/recentlyAddedViewBuyer", {
        user: $.jStorage.get("userInfo")._id,
        type: "count"
      },
      function (data) {
        if (data.data.value) {
          $scope.newlyAddedCount = data.data.data;
        }
      }
    );
  };
  $scope.newlyAddedCount();
  $scope.goToProductDetail = function (productId) {
    console.log("goToProductDetail");
    $state.go("product-detail", {
      // id: $stateParams.id,
      productId: productId
    });
  };
  $scope.$watch(
    function () {
      return $ionicSideMenuDelegate.isOpenLeft();
    },
    function (isOpen) {
      if (isOpen) {
        Navigation.commonAPIWithoutLoader(
          "Product/recentlyAddedViewBuyer", {
            user: $.jStorage.get("userInfo")._id,
            type: "count"
          },
          function (data) {
            if (data.data.value) {
              $scope.newlyAddedCount = data.data.data;
            }
          }
        );
        Navigation.commonAPIWithoutLoader(
          "User/getOne", {
            _id: $.jStorage.get("userInfo")._id
          },
          function (data) {
            if (data.data.value) {
              $scope.user = data.data.data;
            }
          }
        );
        Navigation.commonAPIWithoutLoader(
          "BlockList/getBlockedList", {
            user: $.jStorage.get("userInfo")._id,
            page: 1
          },
          function (data) {
            if (data.data.value) {
              console.log("datatatata", data.data.data);
              $scope.blockedCount = _.size(data.data.data);
            }
          }
        );
      } else {
        console.log("close");
      }
    }
  );
  // if ($.jStorage.get("userInfo")._id) {
  //   Navigation.commonAPIWithoutLoader(
  //     "User/getOne", {
  //       _id: $.jStorage.get("userInfo")._id
  //     },
  //     function (data) {
  //       if (data.data.value) {
  //         $scope.user = data.data.data;
  //         console.log("$scope.user ---> controller", $scope.user);
  //       }
  //     }
  //   );
  // }
  $scope.retailorType = $.jStorage.get("type");
  console.log($scope.retailorType);
  var va = false;
  $scope.goToCategories = function () {
    // console.log("......", $scope.user.isAccessories);
    if ($scope.userInfo.isAccessories) {
      $state.go("accessory", {
        id: $.jStorage.get("userInfo")._id
      });
    } else {
      $state.go("category", {
        id: $.jStorage.get("userInfo")._id
      });
    }
  };
  $scope.viewNotification = function () {
    if ($.jStorage.get("userInfo").isSeller) {
      $state.go("tab.notification", {
        innerTab: "General"
      });
    } else {
      $state.go("tab.buyernotification", {
        innerTab: "General"
      });
    }
    Navigation.commonAPICall(
      "Notification/viewNotification", {
        user: $.jStorage.get("userInfo")
      },
      function (data) {
        if (data.data.value) {
          $scope.notificationCount = 0;
        }
      }
    );
  };
  $scope.goToShop = function () {
    $state.go("tab.myshop");
  };
  $scope.recentlyAdded = function () {
    $state.go("recently-added", {
      id: $.jStorage.get("userInfo")._id
    });
  };

  $scope.Logout = function () {
    $ionicPopup.show({
      title: "LOGOUT",
      subTitle: "Are you sure you want to logout?",
      scope: $scope,
      cssClass: "logoutPopup",
      buttons: [{
          text: "<b>Yes</b>",
          type: "button-positive",
          onTap: function (e) {
            Navigation.commonAPICall(
              "User/removeDeviceId", {
                _id: $.jStorage.get("userInfo")._id
              },
              function (data) {}
            );
            startApplication();
            location.reload();
            $.jStorage.flush();
            $state.go("login");
            mySocket.disconnect();
          }
        },
        {
          text: "No"
        }
      ]
    });
  };

  $scope.shareAppLink = function () {
    var link =
      "https://play.google.com/store/apps/details?id=com.fabricterminal.app&hl=en";
    window.open(link, "_self");
    $cordovaSocialSharing
      .share(
        "Hey download 'Fabric Terminal' app. This app connects fabric suppliers & garment manufactures across the country",
        "",
        "",
        link
      ) // Share via native share sheet
      .then(
        function (result) {
          // Success!
        },
        function (err) {
          // An error occured. Show a message to the user
        }
      );
  };
  $scope.twitter = "https://twitter.com/FabricTerminal";
  $scope.instagram = "https://www.instagram.com/fabricterminal/";
  $scope.fb = "https://www.facebook.com/FabricTerminal";
  $scope.openSocialLink = function (social) {
    var url = $scope[social];
    var options = {
      location: "no",
      clearcache: "yes",
      toolbar: "no"
    };
    window.open(url, "_blank")
    // document.addEventListener(
    //   "deviceready",
    //   function () {
    //     $cordovaInAppBrowser
    //       .open(url, "_self", options)
    //       .then(function (event) {
    //         // success
    //       })
    //       .catch(function (event) {
    //         // error
    //       });
    //     // $cordovaInAppBrowser.close();
    //   },
    //   false
    // );
  };
  // Default handlers
  var successCallback = function (data) {};
  var errorCallback = function (errMsg) {
    console.log(errMsg);
  };
  $scope.openPaytm = function () {
    window.open("https://paytm.com/", "_blank")
    console.log("demo paytm");
    // window.plugins.launcher.launch({
    //     uri: "paytm://"
    //   },
    //   successCallback,
    //   errorCallback
    // );
  };

});
