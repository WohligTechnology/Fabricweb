  myApp.controller("SubscriptionInvoiceCtrl", function ($scope,$location, $stateParams, Navigation, $state, $cordovaInAppBrowser, $rootScope, $timeout, $ionicHistory, $window) {
// var adminSocket = "http://192.168.1.106:1337/";
// var adminSocket = "http://payment.fabricterminal.com/";
var adminSocket = "http://localhost:1337/";
var adminUrl = adminSocket + "api/";

  // if ($stateParams.id) {}
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
      console.log("got plans", data);
      $scope.plan = data.data.data;
      $scope.amount = data.data.data.amount;
      $scope.expiryDate = moment($.jStorage.get('userInfo').expiryDate).format('DD-MM-YYYY');
      $scope.today = moment().format('DD-MM-YYYY');
    })
  }
  getPlans();
  $scope.state = $.jStorage.get('userInfo').state;
  Navigation.commonAPICall('User/getExpiryDate', {
    _id: $.jStorage.get('userInfo'),
    checkExpiry: false
  }, function (data) {
    $scope.startDate = moment(data.data.data).format('DD-MM-YYYY');
    $scope.endDate = moment($scope.startDate, 'DD-MM-YYYY').add($scope.plan.period, 'days').format('DD-MM-YYYY');
  });
  // $scope.proceedToPayment = function () {
  //   console.log("Proced to Payment");
  //   Navigation.commonAPICall('Payment/payWithCCavenue', {
  //     "name": $.jStorage.get('userInfo').name,
  //     "amount": $scope.amount,
  //     "user": $.jStorage.get('UserId'),
  //     "checkExpiry": false
  //   }, function (data) {
  //     console.log("datadatadata",data)
  //     var options = {
  //       location: 'no',
  //       clearcache: 'yes',
  //       toolbar: 'no'
  //     };
  //     var pageContent =  data.data 
  //     var pageContentUrl = 'data:text/html;base64,' + btoa(pageContent);
  //     console.log("pageContentUrlpageContentUrl", pageContentUrl);
  //     // window.open(pageContentUrl,'_blank');
  //     // $window.location.url = pageContentUrl;     

  //     // document.addEventListener("deviceready", function () {
  //     //   $cordovaInAppBrowser.open(pageContentUrl, '_self', options)
  //     //     .then(function (event) {
  //     //       // success
  //     //     })
  //     //     .catch(function (event) {
  //     //       // error
  //     //     });
  //     //   // $cordovaInAppBrowser.close();
  //     //   $rootScope.$on('$cordovaInAppBrowser:loadstop', function (e, event) {
  //     //     console.log(event.url);
  //     //     // event.url="http://wohlig.co.in/paisoapk/success.html?transactionId=1231321231";
  //     //     url = event.url.split("?")[0];
  //     //     transactionId = event.url.split("=")[1];
  //     //     // console.log(url, order_id);
  //     //     if (url == "http://payment.fabricterminal.com/failure") {
  //     //       var stateName = $ionicHistory.backView().stateName;
  //     //       $timeout(function () {
  //     //         $cordovaInAppBrowser.close();
  //     //         // if (stateName == 'subscription') {
  //     //         //   var goto;
  //     //         //   if ($.jStorage.get('userInfo').isSeller && $.jStorage.get('userInfo').isTextile) {
  //     //         //     goto = "category";
  //     //         //   } else if ($.jStorage.get('userInfo').isSeller && $.jStorage.get('userInfo').isAccessories) {
  //     //         //     goto = "accessory";
  //     //         //   } else if ($.jStorage.get('userInfo').isBuyer) {
  //     //         //     //ionicToast.show("Buyer Section Inactive", 'middle');
  //     //         //     console.log("Buyer category goto");
  //     //         //     goto = "buyer-category";
  //     //         //   }
  //     //         //   if (!$.jStorage.get('userInfo').isBuyer) {
  //     //         //     $state.go(goto, {
  //     //         //       id: $.jStorage.get('userInfo')._id
  //     //         //     });
  //     //         //   } else {
  //     //         //     $state.go(goto, {
  //     //         //       id: $.jStorage.get('userInfo')._id
  //     //         //     });
  //     //         //   }
  //     //         // } else {
  //     //         //   if ($.jStorage.get('userInfo').isSeller) {
  //     //         //     $state.go("tab.myshop");
  //     //         //   } else if ($.jStorage.get('userInfo').isBuyer) {
  //     //         //     $state.go("tab.market");
  //     //         //   }
  //     //         // }
  //     //       }, 3000);
  //     //     } else if (url == "http://payment.fabricterminal.com/success") {
  //     //       var stateName = $ionicHistory.backView().stateName;
  //     //       $timeout(function () {
  //     //         $cordovaInAppBrowser.close();
  //     //         if (stateName == 'subscription') {
  //     //           var goto;
  //     //           if ($.jStorage.get('userInfo').isSeller && $.jStorage.get('userInfo').isTextile) {
  //     //             goto = "category";
  //     //           } else if ($.jStorage.get('userInfo').isSeller && $.jStorage.get('userInfo').isAccessories) {
  //     //             goto = "accessory";
  //     //           } else if ($.jStorage.get('userInfo').isBuyer) {
  //     //             //ionicToast.show("Buyer Section Inactive", 'middle');
  //     //             console.log("Buyer category goto");
  //     //             goto = "buyer-category";
  //     //           }
  //     //           if (!$.jStorage.get('userInfo').isBuyer) {
  //     //             $state.go(goto, {
  //     //               id: $.jStorage.get('userInfo')._id,
  //     //               firstVisit: true
  //     //             });
  //     //           } else {
  //     //             $state.go(goto, {
  //     //               id: $.jStorage.get('userInfo')._id,
  //     //               firstVisit: true
  //     //             });
  //     //           }
  //     //         } else {
  //     //           if ($.jStorage.get('userInfo').isSeller) {
  //     //             $state.go("tab.myshop");
  //     //           } else if ($.jStorage.get('userInfo').isBuyer) {
  //     //             $state.go("tab.market");
  //     //           }
  //     //         }
  //     //       }, 3000);
  //     //     }
  //     //   });
  //     // }, false);
  //   })
  // }

  $scope.goBackHandler = function () {
    Navigation.gobackHandler(); //This works
  };
  $scope.proceedToPayment = function () {
      var payData = "name="+$.jStorage.get('userInfo').name +"&amount="+$scope.amount +"&user="+$.jStorage.get('UserId')+"&checkExpiry=false";
      window.location.href = adminUrl + "Payment/payWithCCavenueWebView?" + payData;
  }
});
