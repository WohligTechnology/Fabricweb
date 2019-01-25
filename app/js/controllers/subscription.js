myApp.controller("SubscriptionCtrl", function (
  $scope,
  $stateParams,
  Navigation,
  $state,
  ionicToast,
  $ionicActionSheet,
  $cordovaCamera,
  $cordovaFileTransfer,
  $cordovaImagePicker,
  $cordovaInAppBrowser,
  $cordovaSocialSharing
) {
  if ($stateParams.id) {
    Navigation.commonAPIWithoutLoader(
      "User/getOne", {
        _id: $stateParams.id,
        checkExpiry: false
      },
      function (data) {
        if (data.data.value) {
          $.jStorage.set("userInfo", data.data.data);
          $scope.formData = data.data.data;
          getPlans();
          if (data.data.data.isBuyer == true) {
            $scope.amount = 3600;
          } else {
            $scope.amount = 12000;
          }
        }
      }
    );
  }

  var getPlans = function () {
    var userType = ''
    if ($.jStorage.get('userInfo').isBuyer == true) {
      userType = 'Buyer';
    } else {
      userType = 'Seller';
    }
    Navigation.commonAPICall('Plan/getUserTypeWisePlan', {
      planType: userType,
      checkExpiry: false
    }, function (data) {
      $scope.plan = data.data.data;
    })
  }
  // $scope.doPayment = function(){
  //   Navigation.commonAPICall('Payment/payWithCCavenue', {
  //     "name": "Prajakta",
  //     "amount": 1,
  //     "user": $.jStorage.get('UserId')
  //   }, function (data) {
  //     var options = {
  //       location: 'no',
  //       clearcache: 'yes',
  //       toolbar: 'no'
  //     };
  //     var pageContent = '<html><head></head><body>' + data.data + '</body></html>';
  //     var pageContentUrl = 'data:text/html;base64,' + btoa(pageContent);
  //     document.addEventListener("deviceready", function () {
  //
  //       $cordovaInAppBrowser.open(pageContentUrl, '_self', options)
  //         .then(function (event) {
  //           // success
  //         })
  //         .catch(function (event) {
  //           // error
  //         });
  //       // $cordovaInAppBrowser.close();
  //       $rootScope.$on('$cordovaInAppBrowser:loadstop', function (e, event) {
  //         console.log(event.url);
  //         // event.url="http://wohlig.co.in/paisoapk/success.html?transactionId=1231321231";
  //         url = event.url.split("?")[0];
  //         transactionId = event.url.split("=")[1];
  //         // console.log(url, order_id);
  //         if (url == "http://payment.fabricterminal.com/failure") {
  //           $timeout(function () {
  //             $cordovaInAppBrowser.close();
  //             if ($.jStorage.get('userInfo').isSeller) {
  //               $state.go("tab.myshop");
  //             } else if ($.jStorage.get('userInfo').isBuyer) {
  //               $state.go("tab.market");
  //             }
  //           }, 3000);
  //         } else if (url == "http://payment.fabricterminal.com/success") {
  //           $timeout(function () {
  //             $cordovaInAppBrowser.close();
  //             if ($.jStorage.get('userInfo').isSeller) {
  //               $state.go("tab.myshop");
  //             } else if ($.jStorage.get('userInfo').isBuyer) {
  //               $state.go("tab.market");
  //             }
  //           }, 3000);
  //         }
  //       });
  //
  //       // var ref = cordova.InAppBrowser.open(pageContentUrl, '_self', options);
  //       // ref.addEventListener('loadstop', function (event) {
  //       //   console.log(event.url);
  //       //   // event.url="http://wohlig.co.in/paisoapk/success.html?transactionId=1231321231";
  //       //   url = event.url.split(".html")[0] + ".html";
  //       //   transactionId = event.url.split("=")[1];
  //       //   console.log(url, order_id);
  //       //   if (url == "http://payment.fabricterminal.com/failure") {
  //       //     ref.close();
  //       //     var alertPopup = $ionicPopup.alert({
  //       //       template: '<h4 style="text-align:center;">Some Error Occurred. Payment Failed</h4>'
  //       //     });
  //       //     alertPopup.then(function (res) {
  //       //       alertPopup.close();
  //       //     });
  //       //   } else if (url == "http://payment.fabricterminal.com/success") {
  //       //     ref.close();
  //       //   }
  //       // });
  //     }, false);
  //   })
  // }
  $scope.goTo = function () {

    Navigation.commonAPICall('User/freeTrial', {
      _id: $.jStorage.get('userInfo')._id,
      name: $.jStorage.get('name'),
      checkExpiry: false
    }, function (data) {
      console.log(data);
      var goto;
      if ($scope.formData.isSeller && $scope.formData.isTextile) {
        goto = "category";
      } else if ($scope.formData.isSeller && $scope.formData.isAccessories) {
        goto = "accessory";
      } else if ($scope.formData.isBuyer) {
        //ionicToast.show("Buyer Section Inactive", 'middle');
        console.log("Buyer category goto");
        goto = "buyer-category";
      }
      if (!$scope.formData.isBuyer) {
        $state.go(goto, {
          id: $stateParams.id,
          firstVisit: true
        });
      } else {
        $state.go(goto, {
          id: $stateParams.id,
          firstVisit: true
        });
      }
    });
  };

  $scope.termsPolicy = "http://fabricterminal.com/policy.html";
  $scope.openLink = function (social) {
    var url = $scope[social];
    var options = {
      location: "no",
      clearcache: "yes",
      toolbar: "no"
    };
    document.addEventListener(
      "deviceready",
      function () {
        $cordovaInAppBrowser
          .open(url, "_self", options)
          .then(function (event) {
            // success
          })
          .catch(function (event) {
            // error
          });
        // $cordovaInAppBrowser.close();
      },
      false
    );
  };
  // Default handlers
  var successCallback = function (data) {};
  var errorCallback = function (errMsg) {
    console.log(errMsg);
  };
  $scope.termsPolicy = "http://fabricterminal.com/policy.html"
  $scope.openLink = function (social) {
    var url = $scope[social];
    var options = {
      location: "no",
      clearcache: "yes",
      toolbar: "no"
    };
    document.addEventListener(
      "deviceready",
      function () {
        $cordovaInAppBrowser
          .open(url, "_self", options)
          .then(function (event) {
            // success
          })
          .catch(function (event) {
            // error
          });
        // $cordovaInAppBrowser.close();
      },
      false
    );
  };
});
