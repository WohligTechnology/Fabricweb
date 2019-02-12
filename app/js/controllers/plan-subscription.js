myApp.controller('PlansubscriptionCtrl', function ($scope, Navigation, $cordovaInAppBrowser, $stateParams, $cordovaSocialSharing, $state) {
  $scope.expiry = $stateParams.expiry;
  console.log($stateParams.expiry);
  $scope.goBackHandler = function () {
    Navigation.gobackHandler(); //This works
  };

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
      // $scope.expiryDate = moment($.jStorage.get('userInfo').expiryDate).format('DD-MM-YYYY');

      $scope.today = moment().format('DD-MM-YYYY');
    })
  }
  getPlans();

  Navigation.commonAPIWithoutLoader("User/getOne", {
    _id: $.jStorage.get('userInfo')._id,
    checkExpiry: false
  }, function (data) {
    if (data.data.value) {
      $scope.user = data.data.data;
      $scope.expiryDate = moment($scope.user.expiryDate).format('DD-MM-YYYY');
      console.log("$scope.expiryDate", $scope.expiryDate);
      $scope.currentDate = moment().format('DD-MM-YYYY');
    }
  });
  $scope.termsPolicy = "http://fabricterminal.com/policy.html";
  $scope.openLink = function (social) {
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
})
